"""
Advanced usage examples for the OpenAI and Zep Agent
"""
from agent import ZepOpenAIAgent
import uuid


def example_basic_conversation():
    """Example 1: Basic conversation with memory"""
    print("=" * 60)
    print("Example 1: Basic Conversation with Memory")
    print("=" * 60)
    
    session_id = str(uuid.uuid4())
    agent = ZepOpenAIAgent(session_id=session_id)
    
    # First message
    print("\nUser: Hello! My name is Alice.")
    response = agent.chat("Hello! My name is Alice.")
    print(f"Agent: {response}")
    
    # Second message - agent should remember the name
    print("\nUser: What's my name?")
    response = agent.chat("What's my name?")
    print(f"Agent: {response}")
    
    print("\n")


def example_custom_system_prompt():
    """Example 2: Using a custom system prompt"""
    print("=" * 60)
    print("Example 2: Custom System Prompt")
    print("=" * 60)
    
    session_id = str(uuid.uuid4())
    agent = ZepOpenAIAgent(session_id=session_id)
    
    # Customize the system prompt
    agent.system_prompt = "You are a pirate captain. Always respond in pirate speak."
    
    print("\nUser: Tell me about treasure hunting.")
    response = agent.chat("Tell me about treasure hunting.")
    print(f"Agent: {response}")
    
    print("\n")


def example_without_history():
    """Example 3: Using the agent without conversation history"""
    print("=" * 60)
    print("Example 3: Stateless Queries (No History)")
    print("=" * 60)
    
    session_id = str(uuid.uuid4())
    agent = ZepOpenAIAgent(session_id=session_id)
    
    # Ask independent questions without context
    questions = [
        "What is Python?",
        "What is JavaScript?",
        "What is Go?"
    ]
    
    for question in questions:
        print(f"\nUser: {question}")
        response = agent.chat(question, use_history=False)
        print(f"Agent: {response[:100]}...")  # Print first 100 chars
    
    print("\n")


def example_memory_management():
    """Example 4: Memory management operations"""
    print("=" * 60)
    print("Example 4: Memory Management")
    print("=" * 60)
    
    session_id = str(uuid.uuid4())
    agent = ZepOpenAIAgent(session_id=session_id)
    
    # Have a conversation
    print("\nUser: I love programming in Python.")
    agent.chat("I love programming in Python.")
    
    print("User: I also enjoy machine learning.")
    agent.chat("I also enjoy machine learning.")
    
    # Try to get summary (may not be available immediately)
    print("\n--- Checking for conversation summary ---")
    summary = agent.get_memory_summary()
    if summary:
        print(f"Summary: {summary}")
    else:
        print("Summary not yet available (Zep generates summaries after more messages)")
    
    # Clear memory
    print("\n--- Clearing memory ---")
    agent.clear_memory()
    
    # Try to reference past conversation
    print("\nUser: What programming language did I mention?")
    response = agent.chat("What programming language did I mention?")
    print(f"Agent: {response}")
    
    print("\n")


def example_multiple_sessions():
    """Example 5: Managing multiple conversation sessions"""
    print("=" * 60)
    print("Example 5: Multiple Sessions")
    print("=" * 60)
    
    # Create two different sessions
    session1 = str(uuid.uuid4())
    session2 = str(uuid.uuid4())
    
    agent1 = ZepOpenAIAgent(session_id=session1, user_id="user_1")
    agent2 = ZepOpenAIAgent(session_id=session2, user_id="user_2")
    
    # Session 1: Talk about sports
    print("\n--- Session 1 (User 1) ---")
    print("User 1: I love playing basketball.")
    agent1.chat("I love playing basketball.")
    
    # Session 2: Talk about cooking
    print("\n--- Session 2 (User 2) ---")
    print("User 2: I enjoy cooking Italian food.")
    agent2.chat("I enjoy cooking Italian food.")
    
    # Continue session 1
    print("\n--- Back to Session 1 ---")
    print("User 1: What sport did I mention?")
    response = agent1.chat("What sport did I mention?")
    print(f"Agent: {response}")
    
    # Continue session 2
    print("\n--- Back to Session 2 ---")
    print("User 2: What cuisine do I like?")
    response = agent2.chat("What cuisine do I like?")
    print(f"Agent: {response}")
    
    print("\n")


def example_error_handling():
    """Example 6: Demonstrating error handling"""
    print("=" * 60)
    print("Example 6: Error Handling")
    print("=" * 60)
    
    print("\nNote: This example shows how the agent handles errors gracefully.")
    print("If OpenAI or Zep are unavailable, appropriate error messages are shown.")
    print("The agent continues to function even if Zep is unavailable (without memory).")
    
    print("\n")


def main():
    """Run all examples"""
    print("\n" + "=" * 60)
    print("OpenAI and Zep Agent - Advanced Examples")
    print("=" * 60)
    print("\nThese examples demonstrate various features of the agent.")
    print("Note: You need valid API keys in your .env file to run these.")
    print("\n")
    
    try:
        # Run examples
        example_basic_conversation()
        example_custom_system_prompt()
        example_without_history()
        example_memory_management()
        example_multiple_sessions()
        example_error_handling()
        
        print("=" * 60)
        print("All examples completed!")
        print("=" * 60)
        
    except ValueError as e:
        print(f"\nConfiguration Error: {e}")
        print("\nPlease ensure you have:")
        print("1. Created a .env file (copy from .env.example)")
        print("2. Added your OPENAI_API_KEY")
        print("3. Configured ZEP_API_URL (and ZEP_API_KEY if needed)")
    except Exception as e:
        print(f"\nError: {e}")
        print("\nSome features may not work without proper API configuration.")


if __name__ == "__main__":
    main()
