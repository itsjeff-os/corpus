"""
Example usage of the OpenAI and Zep Agent
"""
from agent import ZepOpenAIAgent
import uuid


def main():
    """
    Example demonstrating how to use the ZepOpenAIAgent
    """
    # Create a unique session ID for this conversation
    session_id = str(uuid.uuid4())
    
    print("=== OpenAI and Zep Agent Demo ===")
    print(f"Session ID: {session_id}")
    print("\nType 'quit' to exit, 'clear' to clear memory, 'summary' to see memory summary\n")
    
    # Initialize the agent
    try:
        agent = ZepOpenAIAgent(session_id=session_id, user_id="demo_user")
    except ValueError as e:
        print(f"Configuration error: {e}")
        print("\nPlease ensure you have set up your .env file with required API keys.")
        print("Copy .env.example to .env and fill in your keys.")
        return
    
    # Chat loop
    while True:
        user_input = input("You: ").strip()
        
        if not user_input:
            continue
        
        if user_input.lower() == 'quit':
            print("Goodbye!")
            break
        
        if user_input.lower() == 'clear':
            agent.clear_memory()
            continue
        
        if user_input.lower() == 'summary':
            summary = agent.get_memory_summary()
            if summary:
                print(f"\nMemory Summary: {summary}\n")
            else:
                print("\nNo summary available yet.\n")
            continue
        
        # Get response from agent
        response = agent.chat(user_input)
        print(f"Agent: {response}\n")


if __name__ == "__main__":
    main()
