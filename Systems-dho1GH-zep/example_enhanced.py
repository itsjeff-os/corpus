"""
Example demonstrating enhanced agent with conversation graph and dynamic context
"""
import os
# Set up mock environment for demo purposes
os.environ.setdefault('OPENAI_API_KEY', 'demo-key-not-real')

from agent_enhanced import EnhancedZepOpenAIAgent, ConversationNode
import uuid
from datetime import datetime
from unittest.mock import patch, MagicMock


def example_basic_graph_tracking():
    """Example 1: Basic conversation with graph tracking"""
    print("=" * 70)
    print("Example 1: Conversation Graph Tracking")
    print("=" * 70)
    
    session_id = str(uuid.uuid4())
    
    with patch('agent.openai.OpenAI'), patch('agent.Zep'):
        with patch('agent_enhanced.tiktoken.encoding_for_model') as mock_encoding:
            mock_enc = MagicMock()
            mock_enc.encode.return_value = [1, 2, 3]
            mock_encoding.return_value = mock_enc
            
            agent = EnhancedZepOpenAIAgent(session_id=session_id, enable_graph=True)
            
            print(f"\nSession ID: {session_id}")
            print(f"Graph enabled: {agent.enable_graph}\n")
            
            # Show graph stats
            stats = agent.get_graph_stats()
            print(f"Graph stats: {stats}\n")
            
            print("The agent maintains a graph structure where:")
            print("- Each message is a node")
            print("- Nodes are connected by parent-child relationships")
            print("- You can navigate the conversation as a tree")


def example_dynamic_context_selection():
    """Example 2: Dynamic context window management"""
    print("=" * 70)
    print("Example 2: Dynamic Context Selection")
    print("=" * 70)
    
    from agent_enhanced import DynamicContextManager
    
    # This would work with actual tiktoken encoding in production
    print("\nDynamic context manager selects the most relevant messages")
    print("based on token limits and conversation relevance.\n")
    
    print("Features:")
    print("- Automatic token counting for all messages")
    print("- Prioritizes recent messages within token budget")
    print("- Includes relevant historical context based on query")
    print("- Ensures responses fit within model context window\n")


def example_conversation_branching():
    """Example 3: Branching conversations"""
    print("=" * 70)
    print("Example 3: Conversation Branching")
    print("=" * 70)
    
    session_id = str(uuid.uuid4())
    agent = EnhancedZepOpenAIAgent(session_id=session_id, enable_graph=True)
    
    print("\nThe graph structure allows branching conversations:")
    print("- Multiple conversation paths from same starting point")
    print("- Switch between different discussion threads")
    print("- Navigate conversation history as a tree")
    print("- Explore different conversational directions\n")
    
    # Demonstrate graph structure
    from agent_enhanced import ConversationGraph, ConversationNode
    
    graph = ConversationGraph()
    
    # Create a branching conversation
    node1 = ConversationNode("msg1", "user", "What's AI?", datetime.now())
    node2 = ConversationNode("msg2", "assistant", "AI is...", datetime.now())
    node3a = ConversationNode("msg3a", "user", "Tell me about ML", datetime.now())
    node3b = ConversationNode("msg3b", "user", "Tell me about NLP", datetime.now())
    
    graph.add_node(node1)
    graph.add_node(node2, parent_id="msg1")
    graph.add_node(node3a, parent_id="msg2")  # Branch A
    graph.add_node(node3b, parent_id="msg2")  # Branch B
    
    print(f"Graph has {len(graph.nodes)} nodes")
    print(f"Root nodes: {len(graph.root_nodes)}")
    print(f"Node 'msg2' has {len(graph.nodes['msg2'].children)} children (branches)\n")


def example_relevance_based_retrieval():
    """Example 4: Relevance-based context retrieval"""
    print("=" * 70)
    print("Example 4: Relevance-Based Context Retrieval")
    print("=" * 70)
    
    from agent_enhanced import ConversationGraph, ConversationNode
    
    graph = ConversationGraph()
    
    # Add various conversation nodes on different topics
    topics = [
        ("msg1", "user", "I love Python programming"),
        ("msg2", "assistant", "Python is great for data science"),
        ("msg3", "user", "What about JavaScript?"),
        ("msg4", "assistant", "JavaScript is excellent for web dev"),
        ("msg5", "user", "How do I learn Python?"),
    ]
    
    for msg_id, role, content in topics:
        node = ConversationNode(msg_id, role, content, datetime.now())
        graph.add_node(node)
    
    # Retrieve relevant context for a Python query
    print("\nQuery: 'Can you help me with Python?'")
    relevant = graph.get_relevant_context("Can you help me with Python?", max_nodes=3)
    
    print(f"Found {len(relevant)} relevant nodes:")
    for node in relevant:
        print(f"  - [{node.role}]: {node.content}")
    print()


def example_enhanced_features_comparison():
    """Example 5: Comparison with base agent"""
    print("=" * 70)
    print("Example 5: Enhanced vs Base Agent Features")
    print("=" * 70)
    
    print("\nBase ZepOpenAIAgent features:")
    print("✓ OpenAI GPT integration")
    print("✓ Zep memory persistence")
    print("✓ Session management")
    print("✓ Linear conversation history")
    print("✓ Memory summarization")
    
    print("\nEnhancedZepOpenAIAgent additional features:")
    print("✓ Conversation graph structure")
    print("✓ Branch and navigate conversations")
    print("✓ Dynamic context window management")
    print("✓ Token-aware history selection")
    print("✓ Relevance-based context retrieval")
    print("✓ Parent-child message relationships")
    print("✓ Topic-based message organization")
    print("✓ Conversation statistics and analytics\n")


def example_use_cases():
    """Example 6: Real-world use cases"""
    print("=" * 70)
    print("Example 6: Real-World Use Cases")
    print("=" * 70)
    
    print("\nUse Case 1: Customer Support")
    print("- Track multiple issue threads in one session")
    print("- Branch to explore different solutions")
    print("- Retrieve relevant past interactions")
    
    print("\nUse Case 2: Educational Tutoring")
    print("- Explore topics in a branching manner")
    print("- Return to previous concepts")
    print("- Context-aware explanations")
    
    print("\nUse Case 3: Creative Writing")
    print("- Explore multiple story directions")
    print("- Branch narrative paths")
    print("- Maintain consistency across branches")
    
    print("\nUse Case 4: Code Review Assistant")
    print("- Discuss multiple code sections")
    print("- Context-aware suggestions")
    print("- Track conversation per file/function\n")


def main():
    """Run all examples"""
    print("\n" + "=" * 70)
    print("Enhanced Agent Examples - Graph & Dynamic Context")
    print("=" * 70)
    print("\nThese examples demonstrate the new features added to the agent:")
    print("- Conversational graph for tracking message relationships")
    print("- Dynamic context selection based on token limits")
    print("- Relevance-based context retrieval")
    print("- Branching conversation support\n")
    
    try:
        example_basic_graph_tracking()
        example_dynamic_context_selection()
        example_conversation_branching()
        example_relevance_based_retrieval()
        example_enhanced_features_comparison()
        example_use_cases()
        
        print("=" * 70)
        print("All examples completed!")
        print("=" * 70)
        print("\nNote: To use with real API keys:")
        print("1. Create a .env file with OPENAI_API_KEY")
        print("2. Optionally configure ZEP_API_URL and ZEP_API_KEY")
        print("3. Replace example calls with actual agent.chat() calls\n")
        
    except Exception as e:
        print(f"\nError: {e}")


if __name__ == "__main__":
    main()
