"""
OpenAI and Zep Agent Implementation
"""
from typing import List, Optional, Dict, Any
import logging
import openai
from zep_python.client import Zep
from zep_python import Message
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ZepOpenAIAgent:
    """
    An agent that uses OpenAI for natural language processing
    and Zep for conversation memory management.
    """
    
    def __init__(self, session_id: str, user_id: Optional[str] = None):
        """
        Initialize the agent with OpenAI and Zep
        
        Args:
            session_id: Unique identifier for the conversation session
            user_id: Optional user identifier
            
        Raises:
            ValueError: If session_id is empty or invalid
        """
        Config.validate()
        
        # Validate session_id to ensure it is a non-empty string
        if not isinstance(session_id, str) or not session_id.strip():
            raise ValueError("session_id must be a non-empty string")
        
        self.session_id = session_id.strip()
        self.user_id = user_id or "default_user"
        
        # Initialize OpenAI client
        self.openai_client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)
        
        # Initialize Zep client with graceful degradation
        self.zep_client = None
        self.zep_available = False
        try:
            if Config.ZEP_API_KEY:
                self.zep_client = Zep(
                    base_url=Config.ZEP_API_URL,
                    api_key=Config.ZEP_API_KEY
                )
            else:
                self.zep_client = Zep(base_url=Config.ZEP_API_URL)
            self.zep_available = True
            logger.info(f"Zep client initialized successfully for session {self.session_id}")
        except Exception as e:
            logger.warning(f"Failed to initialize Zep client: {e}. Continuing without persistent memory.")
            self.zep_available = False
        
        self.system_prompt = f"You are {Config.AGENT_NAME}, a helpful AI assistant."
    
    def _get_conversation_history(self) -> List[Dict[str, str]]:
        """
        Retrieve conversation history from Zep
        
        Returns:
            List of message dictionaries
        """
        if not self.zep_available or not self.zep_client:
            logger.debug("Zep not available, returning empty history")
            return []
            
        try:
            memory = self.zep_client.memory.get(self.session_id)
            
            messages = []
            if memory and memory.messages:
                for msg in memory.messages:
                    # role_type is the primary field; fall back to legacy role when reading for backward compatibility
                    role = msg.role_type if msg.role_type else msg.role
                    messages.append({
                        "role": role,
                        "content": msg.content
                    })
            
            return messages
        except Exception as e:
            logger.warning(f"Could not retrieve memory from Zep: {e}")
            return []
    
    def _save_to_memory(self, user_message: str, assistant_message: str):
        """
        Save the conversation turn to Zep
        
        Args:
            user_message: The user's message
            assistant_message: The assistant's response
        """
        if not self.zep_available or not self.zep_client:
            logger.debug("Zep not available, skipping memory save")
            return
            
        try:
            messages = [
                Message(role_type="user", content=user_message),
                Message(role_type="assistant", content=assistant_message)
            ]
            
            self.zep_client.memory.add(self.session_id, messages=messages)
            logger.debug(f"Saved conversation turn to Zep for session {self.session_id}")
        except Exception as e:
            logger.warning(f"Could not save memory to Zep: {e}")
    
    def chat(self, user_message: str, use_history: bool = True) -> str:
        """
        Send a message and get a response from the agent
        
        Args:
            user_message: The user's input message
            use_history: Whether to include conversation history
        
        Returns:
            The agent's response
            
        Raises:
            ValueError: If user_message is empty or whitespace
        """
        # Validate user input
        if not isinstance(user_message, str) or not user_message.strip():
            raise ValueError("user_message must be a non-empty string")
        
        user_message = user_message.strip()
        
        # Prepare messages for OpenAI
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add conversation history from Zep if requested
        if use_history:
            history = self._get_conversation_history()
            messages.extend(history)
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Get response from OpenAI
        try:
            response = self.openai_client.chat.completions.create(
                model=Config.OPENAI_MODEL,
                messages=messages,
                max_tokens=Config.MAX_TOKENS,
                temperature=Config.TEMPERATURE
            )
            
            # Validate that the response contains at least one choice with message content
            if not hasattr(response, "choices") or not response.choices:
                raise ValueError("OpenAI API response contains no choices")
            
            first_choice = response.choices[0]
            if not hasattr(first_choice, "message") or not hasattr(first_choice.message, "content"):
                raise ValueError("OpenAI API response missing message content")
            
            assistant_message = first_choice.message.content
            
            # Save to Zep memory only when history is being used
            if use_history:
                self._save_to_memory(user_message, assistant_message)
            
            return assistant_message
            
        except openai.OpenAIError as e:
            # Handle OpenAI-specific API errors separately from other unexpected errors
            logger.error(f"OpenAI API error: {e}")
            return "I encountered an error communicating with the language model. Please try again later."
        except ValueError as e:
            # Handle validation errors
            logger.error(f"Response validation error: {e}")
            return "I received an unexpected response format. Please try again."
        except Exception as e:
            # Fallback for any other unexpected error conditions
            logger.error(f"Unexpected error in chat: {e}")
            return "An unexpected error occurred. Please try again."
    
    def clear_memory(self):
        """Clear the conversation memory for this session"""
        if not self.zep_available or not self.zep_client:
            logger.warning("Zep not available, cannot clear memory")
            return
            
        try:
            self.zep_client.memory.delete(self.session_id)
            logger.info(f"Memory cleared for session: {self.session_id}")
        except Exception as e:
            logger.warning(f"Could not clear memory: {e}")
    
    def get_memory_summary(self) -> Optional[str]:
        """
        Get a summary of the conversation from Zep
        
        Returns:
            Summary text or None
        """
        if not self.zep_available or not self.zep_client:
            logger.debug("Zep not available, cannot retrieve summary")
            return None
            
        try:
            memory = self.zep_client.memory.get(self.session_id)
            if memory and hasattr(memory, 'summary') and memory.summary:
                if hasattr(memory.summary, 'content'):
                    return memory.summary.content
                return str(memory.summary)
            return None
        except Exception as e:
            logger.warning(f"Could not get memory summary: {e}")
            return None
