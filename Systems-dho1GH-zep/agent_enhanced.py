"""
Enhanced OpenAI and Zep Agent with Conversational Graph and Dynamic Context
"""
from typing import List, Optional, Dict, Any, Set, Tuple
import logging
import json
from datetime import datetime
from collections import defaultdict
import tiktoken
import openai
from zep_python.client import Zep
from zep_python import Message
from config import Config
from agent import ZepOpenAIAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConversationNode:
    """Represents a node in the conversation graph"""
    
    def __init__(self, message_id: str, role: str, content: str, timestamp: datetime):
        self.message_id = message_id
        self.role = role
        self.content = content
        self.timestamp = timestamp
        self.children: List[str] = []  # IDs of response messages
        self.parent: Optional[str] = None  # ID of the message this responds to
        self.topics: Set[str] = set()  # Extracted topics/keywords
        self.relevance_score: float = 1.0  # For dynamic context selection
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert node to dictionary for serialization"""
        return {
            "message_id": self.message_id,
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "children": self.children,
            "parent": self.parent,
            "topics": list(self.topics),
            "relevance_score": self.relevance_score
        }


class ConversationGraph:
    """Manages the conversation as a graph structure"""
    
    def __init__(self):
        self.nodes: Dict[str, ConversationNode] = {}
        self.root_nodes: List[str] = []  # Messages that start new conversation threads
        self.current_branch: List[str] = []  # Current conversation path
        
    def add_node(self, node: ConversationNode, parent_id: Optional[str] = None):
        """Add a node to the graph"""
        self.nodes[node.message_id] = node
        
        if parent_id and parent_id in self.nodes:
            node.parent = parent_id
            self.nodes[parent_id].children.append(node.message_id)
        else:
            self.root_nodes.append(node.message_id)
        
        self.current_branch.append(node.message_id)
        
    def get_branch_history(self, node_id: str) -> List[ConversationNode]:
        """Get the conversation history leading to a specific node"""
        history = []
        current_id = node_id
        
        while current_id:
            if current_id in self.nodes:
                history.insert(0, self.nodes[current_id])
                current_id = self.nodes[current_id].parent
            else:
                break
                
        return history
    
    def get_relevant_context(self, query: str, max_nodes: int = 10) -> List[ConversationNode]:
        """
        Get the most relevant nodes for a given query using simple keyword matching.
        In production, this would use semantic similarity.
        """
        query_lower = query.lower()
        scored_nodes = []
        
        for node in self.nodes.values():
            # Simple relevance scoring based on keyword overlap
            content_lower = node.content.lower()
            common_words = set(query_lower.split()) & set(content_lower.split())
            score = len(common_words) * node.relevance_score
            
            if score > 0:
                scored_nodes.append((score, node))
        
        # Sort by score and return top nodes
        scored_nodes.sort(key=lambda x: x[0], reverse=True)
        return [node for _, node in scored_nodes[:max_nodes]]
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize graph to dictionary"""
        return {
            "nodes": {k: v.to_dict() for k, v in self.nodes.items()},
            "root_nodes": self.root_nodes,
            "current_branch": self.current_branch
        }


class DynamicContextManager:
    """Manages dynamic context window with token counting and relevance"""
    
    def __init__(self, model: str = "gpt-4", max_tokens: int = 4000):
        self.model = model
        self.max_tokens = max_tokens
        try:
            self.encoding = tiktoken.encoding_for_model(model)
        except KeyError:
            # Fallback to cl100k_base encoding for unknown models
            self.encoding = tiktoken.get_encoding("cl100k_base")
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in a text string"""
        return len(self.encoding.encode(text))
    
    def count_messages_tokens(self, messages: List[Dict[str, str]]) -> int:
        """Count total tokens in a list of messages"""
        total = 0
        for message in messages:
            # Account for message formatting tokens
            total += 4  # Every message has <im_start>{role/name}\n{content}<im_end>\n
            total += self.count_tokens(message.get("content", ""))
            total += self.count_tokens(message.get("role", ""))
        total += 2  # Account for reply priming
        return total
    
    def select_context(
        self, 
        system_prompt: str,
        current_message: str,
        history: List[Dict[str, str]],
        relevant_nodes: List[ConversationNode] = None
    ) -> List[Dict[str, str]]:
        """
        Select context messages that fit within token budget.
        Prioritizes recent messages and relevant context.
        """
        messages = [{"role": "system", "content": system_prompt}]
        
        # Reserve tokens for system prompt and current message
        used_tokens = self.count_messages_tokens(messages)
        used_tokens += self.count_tokens(current_message) + 4
        
        available_tokens = self.max_tokens - used_tokens - 100  # Reserve 100 for safety
        
        selected_messages = []
        
        # Add relevant context from graph if available
        if relevant_nodes:
            relevant_messages = []
            for node in relevant_nodes:
                msg = {"role": node.role, "content": node.content}
                msg_tokens = self.count_messages_tokens([msg])
                
                if used_tokens + msg_tokens < available_tokens:
                    relevant_messages.append(msg)
                    used_tokens += msg_tokens
                else:
                    break
            
            if relevant_messages:
                selected_messages.extend(relevant_messages)
        
        # Add recent history (most recent first within budget)
        for msg in reversed(history):
            msg_tokens = self.count_messages_tokens([msg])
            
            if used_tokens + msg_tokens < available_tokens:
                selected_messages.insert(0 if not relevant_nodes else len(relevant_messages), msg)
                used_tokens += msg_tokens
            else:
                break
        
        messages.extend(selected_messages)
        messages.append({"role": "user", "content": current_message})
        
        logger.debug(f"Selected context: {len(selected_messages)} messages, ~{used_tokens} tokens")
        return messages


class EnhancedZepOpenAIAgent(ZepOpenAIAgent):
    """
    Enhanced agent with conversational graph and dynamic context handling.
    Extends the base ZepOpenAIAgent with advanced memory and context management.
    """
    
    def __init__(self, session_id: str, user_id: Optional[str] = None, enable_graph: bool = True):
        """
        Initialize the enhanced agent
        
        Args:
            session_id: Unique identifier for the conversation session
            user_id: Optional user identifier
            enable_graph: Whether to enable conversation graph features
        """
        super().__init__(session_id, user_id)
        
        self.enable_graph = enable_graph
        self.conversation_graph = ConversationGraph() if enable_graph else None
        self.context_manager = DynamicContextManager(
            model=Config.OPENAI_MODEL,
            max_tokens=int(Config.MAX_TOKENS * 2)  # Context window is typically 2x response size
        )
        self.message_counter = 0
        
        # Load existing graph from Zep if available
        if self.enable_graph and self.zep_available:
            self._load_graph_from_zep()
    
    def _generate_message_id(self) -> str:
        """Generate a unique message ID"""
        self.message_counter += 1
        return f"{self.session_id}_{self.message_counter}_{datetime.now().timestamp()}"
    
    def _load_graph_from_zep(self):
        """Load conversation graph from Zep metadata"""
        try:
            # Try to load graph structure from Zep metadata
            # This is a placeholder - actual implementation depends on Zep API
            logger.debug("Loading conversation graph from Zep")
        except Exception as e:
            logger.debug(f"Could not load graph from Zep: {e}")
    
    def _save_graph_to_zep(self):
        """Save conversation graph to Zep metadata"""
        if not self.enable_graph or not self.zep_available:
            return
            
        try:
            # Save graph structure - actual implementation depends on Zep API
            graph_data = self.conversation_graph.to_dict()
            logger.debug("Saved conversation graph to Zep")
        except Exception as e:
            logger.warning(f"Could not save graph to Zep: {e}")
    
    def chat(
        self, 
        user_message: str, 
        use_history: bool = True,
        use_dynamic_context: bool = True,
        parent_message_id: Optional[str] = None
    ) -> str:
        """
        Enhanced chat with graph tracking and dynamic context
        
        Args:
            user_message: The user's input message
            use_history: Whether to include conversation history
            use_dynamic_context: Whether to use dynamic context selection
            parent_message_id: Optional parent message ID for branching conversations
        
        Returns:
            The agent's response
        """
        # Validate user input
        if not isinstance(user_message, str) or not user_message.strip():
            raise ValueError("user_message must be a non-empty string")
        
        user_message = user_message.strip()
        
        # Create node for user message
        user_node_id = self._generate_message_id()
        if self.enable_graph:
            user_node = ConversationNode(
                message_id=user_node_id,
                role="user",
                content=user_message,
                timestamp=datetime.now()
            )
            self.conversation_graph.add_node(user_node, parent_message_id)
        
        # Prepare context
        if use_history and use_dynamic_context:
            # Get conversation history
            history = self._get_conversation_history()
            
            # Get relevant context from graph
            relevant_nodes = []
            if self.enable_graph:
                relevant_nodes = self.conversation_graph.get_relevant_context(user_message)
            
            # Use dynamic context selection
            messages = self.context_manager.select_context(
                system_prompt=self.system_prompt,
                current_message=user_message,
                history=history,
                relevant_nodes=relevant_nodes
            )
        elif use_history:
            # Use standard history loading
            messages = [{"role": "system", "content": self.system_prompt}]
            history = self._get_conversation_history()
            messages.extend(history)
            messages.append({"role": "user", "content": user_message})
        else:
            # No history
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_message}
            ]
        
        # Get response from OpenAI
        try:
            response = self.openai_client.chat.completions.create(
                model=Config.OPENAI_MODEL,
                messages=messages,
                max_tokens=Config.MAX_TOKENS,
                temperature=Config.TEMPERATURE
            )
            
            # Validate response
            if not hasattr(response, "choices") or not response.choices:
                raise ValueError("OpenAI API response contains no choices")
            
            first_choice = response.choices[0]
            if not hasattr(first_choice, "message") or not hasattr(first_choice.message, "content"):
                raise ValueError("OpenAI API response missing message content")
            
            assistant_message = first_choice.message.content
            
            # Create node for assistant response
            if self.enable_graph:
                assistant_node_id = self._generate_message_id()
                assistant_node = ConversationNode(
                    message_id=assistant_node_id,
                    role="assistant",
                    content=assistant_message,
                    timestamp=datetime.now()
                )
                self.conversation_graph.add_node(assistant_node, user_node_id)
                self._save_graph_to_zep()
            
            # Save to Zep memory only when history is being used
            if use_history:
                self._save_to_memory(user_message, assistant_message)
            
            return assistant_message
            
        except openai.OpenAIError as e:
            logger.error(f"OpenAI API error: {e}")
            return "I encountered an error communicating with the language model. Please try again later."
        except ValueError as e:
            logger.error(f"Response validation error: {e}")
            return "I received an unexpected response format. Please try again."
        except Exception as e:
            logger.error(f"Unexpected error in chat: {e}")
            return "An unexpected error occurred. Please try again."
    
    def get_conversation_branches(self) -> List[List[str]]:
        """
        Get all conversation branches as lists of message IDs
        
        Returns:
            List of branches, each branch is a list of message IDs
        """
        if not self.enable_graph:
            return []
        
        branches = []
        for root_id in self.conversation_graph.root_nodes:
            branch = self._get_branch_from_node(root_id)
            branches.append(branch)
        
        return branches
    
    def _get_branch_from_node(self, node_id: str) -> List[str]:
        """Recursively get all messages in a branch"""
        branch = [node_id]
        
        if node_id in self.conversation_graph.nodes:
            node = self.conversation_graph.nodes[node_id]
            # For simplicity, follow first child (can be extended for full tree traversal)
            if node.children:
                branch.extend(self._get_branch_from_node(node.children[0]))
        
        return branch
    
    def switch_branch(self, message_id: str) -> bool:
        """
        Switch to a different conversation branch
        
        Args:
            message_id: ID of the message to switch to
            
        Returns:
            True if successful, False otherwise
        """
        if not self.enable_graph or message_id not in self.conversation_graph.nodes:
            return False
        
        # Update current branch to the path leading to this message
        self.conversation_graph.current_branch = [
            node.message_id 
            for node in self.conversation_graph.get_branch_history(message_id)
        ]
        
        logger.info(f"Switched to branch ending at {message_id}")
        return True
    
    def get_graph_stats(self) -> Dict[str, Any]:
        """Get statistics about the conversation graph"""
        if not self.enable_graph:
            return {"graph_enabled": False}
        
        return {
            "graph_enabled": True,
            "total_nodes": len(self.conversation_graph.nodes),
            "root_nodes": len(self.conversation_graph.root_nodes),
            "current_branch_length": len(self.conversation_graph.current_branch),
            "total_branches": len(self.get_conversation_branches())
        }
