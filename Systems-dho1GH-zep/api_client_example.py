"""
Example client for interacting with the OpenAI and Zep Agent API
"""
import requests
import json
from typing import Optional, Dict, Any


class AgentAPIClient:
    """Client for interacting with the Agent API"""
    
    def __init__(self, base_url: str = "http://localhost:5000"):
        """
        Initialize the API client
        
        Args:
            base_url: Base URL of the API server
        """
        self.base_url = base_url.rstrip('/')
        self.session_id: Optional[str] = None
    
    def health_check(self) -> Dict[str, Any]:
        """Check if the API is healthy"""
        response = requests.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()
    
    def chat(
        self,
        message: str,
        session_id: Optional[str] = None,
        use_history: bool = True
    ) -> Dict[str, Any]:
        """
        Send a chat message to the basic agent
        
        Args:
            message: The message to send
            session_id: Optional session ID (will be generated if not provided)
            use_history: Whether to use conversation history
        
        Returns:
            API response with the agent's reply
        """
        payload = {
            "message": message,
            "use_history": use_history
        }
        
        if session_id:
            payload["session_id"] = session_id
        
        response = requests.post(
            f"{self.base_url}/api/v1/chat",
            json=payload
        )
        response.raise_for_status()
        
        result = response.json()
        
        # Store session ID for subsequent requests
        if not self.session_id and result.get('session_id'):
            self.session_id = result['session_id']
        
        return result
    
    def chat_enhanced(
        self,
        message: str,
        session_id: Optional[str] = None,
        use_history: bool = True,
        use_dynamic_context: bool = False,
        enable_graph: bool = True
    ) -> Dict[str, Any]:
        """
        Send a chat message to the enhanced agent
        
        Args:
            message: The message to send
            session_id: Optional session ID
            use_history: Whether to use conversation history
            use_dynamic_context: Enable smart context selection
            enable_graph: Enable conversation graph tracking
        
        Returns:
            API response with the agent's reply and graph stats
        """
        payload = {
            "message": message,
            "use_history": use_history,
            "use_dynamic_context": use_dynamic_context,
            "enable_graph": enable_graph
        }
        
        if session_id:
            payload["session_id"] = session_id
        
        response = requests.post(
            f"{self.base_url}/api/v1/chat/enhanced",
            json=payload
        )
        response.raise_for_status()
        
        result = response.json()
        
        # Store session ID for subsequent requests
        if not self.session_id and result.get('session_id'):
            self.session_id = result['session_id']
        
        return result
    
    def clear_session(self, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Clear conversation memory for a session
        
        Args:
            session_id: Session ID to clear (uses stored session_id if not provided)
        
        Returns:
            API response
        """
        sid = session_id or self.session_id
        if not sid:
            raise ValueError("No session ID provided or stored")
        
        response = requests.post(
            f"{self.base_url}/api/v1/session/{sid}/clear"
        )
        response.raise_for_status()
        return response.json()
    
    def get_graph(self, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get conversation graph statistics
        
        Args:
            session_id: Session ID (uses stored session_id if not provided)
        
        Returns:
            Graph statistics and branches
        """
        sid = session_id or self.session_id
        if not sid:
            raise ValueError("No session ID provided or stored")
        
        response = requests.get(
            f"{self.base_url}/api/v1/session/{sid}/graph"
        )
        response.raise_for_status()
        return response.json()
    
    def list_sessions(self) -> Dict[str, Any]:
        """
        List all active sessions
        
        Returns:
            List of active sessions
        """
        response = requests.get(f"{self.base_url}/api/v1/sessions")
        response.raise_for_status()
        return response.json()


def main():
    """Example usage of the API client"""
    print("=== OpenAI and Zep Agent API Client Example ===\n")
    
    # Initialize client
    client = AgentAPIClient(base_url="http://localhost:5000")
    
    # Health check
    print("1. Checking API health...")
    try:
        health = client.health_check()
        print(f"   ✓ API Status: {health['status']}")
        print(f"   Features: {', '.join(k for k, v in health['features'].items() if v)}")
    except requests.exceptions.RequestException as e:
        print(f"   ✗ API not available: {e}")
        print("\n   Make sure the API server is running:")
        print("   python api.py")
        print("   # or")
        print("   docker-compose up -d")
        return
    
    print()
    
    # Basic chat
    print("2. Testing basic chat...")
    try:
        result = client.chat("Hello! My name is Alice.")
        print(f"   User: Hello! My name is Alice.")
        print(f"   Agent: {result['response'][:100]}...")
        print(f"   Session ID: {result['session_id']}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return
    
    print()
    
    # Follow-up with memory
    print("3. Testing conversation memory...")
    try:
        result = client.chat("What's my name?")
        print(f"   User: What's my name?")
        print(f"   Agent: {result['response'][:100]}...")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print()
    
    # Enhanced chat with graph
    print("4. Testing enhanced agent with graph...")
    try:
        result = client.chat_enhanced(
            "Tell me about Python programming",
            use_dynamic_context=True,
            enable_graph=True
        )
        print(f"   User: Tell me about Python programming")
        print(f"   Agent: {result['response'][:100]}...")
        if result.get('graph_stats'):
            print(f"   Graph Stats: {result['graph_stats']}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print()
    
    # Get graph information
    print("5. Getting conversation graph...")
    try:
        graph = client.get_graph()
        print(f"   Total nodes: {graph['stats']['total_nodes']}")
        print(f"   Total branches: {graph['stats']['total_branches']}")
        if graph.get('branches'):
            print(f"   Branches: {len(graph['branches'])}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print()
    
    # List sessions
    print("6. Listing active sessions...")
    try:
        sessions = client.list_sessions()
        print(f"   Active sessions: {sessions['total']}")
        print(f"   Basic: {len(sessions['basic_sessions'])}")
        print(f"   Enhanced: {len(sessions['enhanced_sessions'])}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print()
    
    # Clear session
    print("7. Clearing session memory...")
    try:
        result = client.clear_session()
        print(f"   ✓ Session cleared: {result['session_id']}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print()
    print("=== Example Complete ===")
    print("\nNext steps:")
    print("- Integrate the AgentAPIClient into your application")
    print("- Deploy to cloud with Docker or Kubernetes")
    print("- Check CLOUD_DEPLOYMENT.md for deployment guides")


if __name__ == "__main__":
    main()
