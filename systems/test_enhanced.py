"""
Enhanced tests with proper mocking for the agent implementation
"""
import sys
import os
from unittest.mock import Mock, MagicMock, patch


def setup_test_environment():
    """Set up mock environment variables for testing"""
    os.environ['OPENAI_API_KEY'] = 'test-key-12345'
    os.environ['ZEP_API_URL'] = 'http://localhost:8000'


def test_imports():
    """Test that all modules can be imported"""
    try:
        from config import Config
        print("✓ Config module imported successfully")
        
        from agent import ZepOpenAIAgent
        print("✓ Agent module imported successfully")
        
        from agent_enhanced import EnhancedZepOpenAIAgent, ConversationGraph, DynamicContextManager
        print("✓ Enhanced agent module imported successfully")
        
        return True
    except ImportError as e:
        print(f"✗ Failed to import modules: {e}")
        return False


def test_config_validation():
    """Test configuration validation"""
    try:
        from config import Config
        Config.validate()
        print("✓ Config validation passed")
        print(f"  - OpenAI Model: {Config.OPENAI_MODEL}")
        print(f"  - Agent Name: {Config.AGENT_NAME}")
        print(f"  - Max Tokens: {Config.MAX_TOKENS}")
        print(f"  - Temperature: {Config.TEMPERATURE}")
        return True
    except Exception as e:
        print(f"✗ Config validation failed: {e}")
        return False


def test_agent_instantiation_with_mocks():
    """Test that agent can be instantiated with mocked dependencies"""
    try:
        from agent import ZepOpenAIAgent
        
        # Mock OpenAI client
        with patch('agent.openai.OpenAI') as mock_openai:
            # Mock Zep client
            with patch('agent.Zep') as mock_zep:
                mock_zep_instance = MagicMock()
                mock_zep.return_value = mock_zep_instance
                
                # Create agent instance
                agent = ZepOpenAIAgent(session_id="test-session-123")
                
                # Verify basic properties
                assert agent.session_id == "test-session-123"
                assert agent.user_id == "default_user"
                assert agent.system_prompt is not None
                
                print("✓ Agent instantiation with mocks successful")
                print(f"  - Session ID: {agent.session_id}")
                print(f"  - User ID: {agent.user_id}")
                print(f"  - Zep Available: {agent.zep_available}")
                
                return True
    except Exception as e:
        print(f"✗ Agent instantiation test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_session_id_validation():
    """Test that session_id is properly validated"""
    try:
        from agent import ZepOpenAIAgent
        
        with patch('agent.openai.OpenAI'), patch('agent.Zep'):
            # Test empty string
            try:
                agent = ZepOpenAIAgent(session_id="")
                print("✗ Should have raised ValueError for empty session_id")
                return False
            except ValueError as e:
                print("✓ Correctly rejected empty session_id")
            
            # Test whitespace only
            try:
                agent = ZepOpenAIAgent(session_id="   ")
                print("✗ Should have raised ValueError for whitespace session_id")
                return False
            except ValueError:
                print("✓ Correctly rejected whitespace-only session_id")
            
            # Test valid session_id
            agent = ZepOpenAIAgent(session_id="valid-session")
            print("✓ Accepted valid session_id")
            
            return True
    except Exception as e:
        print(f"✗ Session ID validation test failed: {e}")
        return False


def test_chat_input_validation():
    """Test that chat method validates user input"""
    try:
        from agent import ZepOpenAIAgent
        
        with patch('agent.openai.OpenAI'), patch('agent.Zep'):
            agent = ZepOpenAIAgent(session_id="test-session")
            
            # Test empty message
            try:
                agent.chat("")
                print("✗ Should have raised ValueError for empty message")
                return False
            except ValueError:
                print("✓ Correctly rejected empty message")
            
            # Test whitespace only
            try:
                agent.chat("   ")
                print("✗ Should have raised ValueError for whitespace message")
                return False
            except ValueError:
                print("✓ Correctly rejected whitespace-only message")
            
            return True
    except Exception as e:
        print(f"✗ Chat input validation test failed: {e}")
        return False


def test_graceful_zep_degradation():
    """Test that agent works without Zep when it fails to initialize"""
    try:
        from agent import ZepOpenAIAgent
        
        with patch('agent.openai.OpenAI'):
            # Make Zep initialization fail
            with patch('agent.Zep', side_effect=Exception("Zep unavailable")):
                agent = ZepOpenAIAgent(session_id="test-session")
                
                # Agent should still be created but with zep_available=False
                assert agent.zep_available == False
                print("✓ Agent gracefully degrades when Zep is unavailable")
                print(f"  - Zep Available: {agent.zep_available}")
                
                return True
    except Exception as e:
        print(f"✗ Graceful degradation test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_conversation_graph():
    """Test conversation graph functionality"""
    try:
        from agent_enhanced import ConversationGraph, ConversationNode
        from datetime import datetime
        
        graph = ConversationGraph()
        
        # Create nodes
        node1 = ConversationNode("msg1", "user", "Hello", datetime.now())
        node2 = ConversationNode("msg2", "assistant", "Hi there!", datetime.now())
        node3 = ConversationNode("msg3", "user", "How are you?", datetime.now())
        
        # Add nodes to graph
        graph.add_node(node1)
        graph.add_node(node2, parent_id="msg1")
        graph.add_node(node3, parent_id="msg2")
        
        # Verify structure
        assert len(graph.nodes) == 3
        assert len(graph.root_nodes) == 1
        assert graph.nodes["msg1"].children == ["msg2"]
        assert graph.nodes["msg2"].parent == "msg1"
        
        # Test branch history
        history = graph.get_branch_history("msg3")
        assert len(history) == 3
        assert history[0].message_id == "msg1"
        assert history[2].message_id == "msg3"
        
        print("✓ Conversation graph tests passed")
        print(f"  - Nodes: {len(graph.nodes)}")
        print(f"  - Root nodes: {len(graph.root_nodes)}")
        print(f"  - Branch history length: {len(history)}")
        
        return True
    except Exception as e:
        print(f"✗ Conversation graph test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_dynamic_context_manager():
    """Test dynamic context management"""
    try:
        from agent_enhanced import DynamicContextManager
        
        # Mock tiktoken to avoid network calls
        with patch('agent_enhanced.tiktoken.encoding_for_model') as mock_encoding:
            with patch('agent_enhanced.tiktoken.get_encoding') as mock_get_encoding:
                # Create a mock encoding object
                mock_enc = MagicMock()
                mock_enc.encode.return_value = [1, 2, 3, 4, 5]  # 5 tokens
                mock_encoding.return_value = mock_enc
                mock_get_encoding.return_value = mock_enc
                
                manager = DynamicContextManager(model="gpt-4", max_tokens=1000)
                manager.encoding = mock_enc  # Ensure our mock is used
                
                # Test token counting
                text = "This is a test message"
                token_count = manager.count_tokens(text)
                assert token_count == 5
                print(f"✓ Token counting works: '{text}' = {token_count} tokens")
                
                # Test message token counting
                messages = [
                    {"role": "user", "content": "Hello"},
                    {"role": "assistant", "content": "Hi there!"}
                ]
                total_tokens = manager.count_messages_tokens(messages)
                assert total_tokens > 0
                print(f"✓ Message token counting: {len(messages)} messages = {total_tokens} tokens")
                
                # Test context selection
                system_prompt = "You are a helpful assistant"
                current_message = "What's the weather?"
                history = [
                    {"role": "user", "content": "Hello"},
                    {"role": "assistant", "content": "Hi!"}
                ]
                
                selected = manager.select_context(system_prompt, current_message, history)
                assert len(selected) >= 3  # At least system, history, and current
                print(f"✓ Context selection: {len(selected)} messages selected")
        
        return True
    except Exception as e:
        print(f"✗ Dynamic context manager test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_enhanced_agent_features():
    """Test enhanced agent with graph and dynamic context"""
    try:
        from agent_enhanced import EnhancedZepOpenAIAgent
        
        with patch('agent.openai.OpenAI'), patch('agent.Zep'):
            with patch('agent_enhanced.tiktoken.encoding_for_model') as mock_encoding:
                with patch('agent_enhanced.tiktoken.get_encoding') as mock_get_encoding:
                    # Create a mock encoding object
                    mock_enc = MagicMock()
                    mock_enc.encode.return_value = [1, 2, 3, 4, 5]
                    mock_encoding.return_value = mock_enc
                    mock_get_encoding.return_value = mock_enc
                    
                    agent = EnhancedZepOpenAIAgent(session_id="test-enhanced", enable_graph=True)
                    
                    # Verify enhanced features
                    assert agent.enable_graph == True
                    assert agent.conversation_graph is not None
                    assert agent.context_manager is not None
                    
                    # Test graph stats
                    stats = agent.get_graph_stats()
                    assert stats["graph_enabled"] == True
                    assert "total_nodes" in stats
                    
                    print("✓ Enhanced agent features initialized")
                    print(f"  - Graph enabled: {agent.enable_graph}")
                    print(f"  - Graph stats: {stats}")
            
            return True
    except Exception as e:
        print(f"✗ Enhanced agent test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    # Set up test environment first
    setup_test_environment()
    
    print("=" * 60)
    print("=== Running Enhanced Agent Tests ===")
    print("=" * 60)
    print()
    
    results = []
    
    # Test 1: Imports
    print("Test 1: Module Imports")
    results.append(test_imports())
    print()
    
    # Test 2: Config
    print("Test 2: Configuration Validation")
    results.append(test_config_validation())
    print()
    
    # Test 3: Agent Instantiation with Mocks
    print("Test 3: Agent Instantiation with Mocks")
    results.append(test_agent_instantiation_with_mocks())
    print()
    
    # Test 4: Session ID Validation
    print("Test 4: Session ID Validation")
    results.append(test_session_id_validation())
    print()
    
    # Test 5: Chat Input Validation
    print("Test 5: Chat Input Validation")
    results.append(test_chat_input_validation())
    print()
    
    # Test 6: Graceful Zep Degradation
    print("Test 6: Graceful Zep Degradation")
    results.append(test_graceful_zep_degradation())
    print()
    
    # Test 7: Conversation Graph
    print("Test 7: Conversation Graph")
    results.append(test_conversation_graph())
    print()
    
    # Test 8: Dynamic Context Manager
    print("Test 8: Dynamic Context Manager")
    results.append(test_dynamic_context_manager())
    print()
    
    # Test 9: Enhanced Agent Features
    print("Test 9: Enhanced Agent Features")
    results.append(test_enhanced_agent_features())
    print()
    
    # Summary
    passed = sum(results)
    total = len(results)
    print("=" * 60)
    print(f"Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All tests passed!")
        return 0
    else:
        print("✗ Some tests failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
