"""
Basic tests for the agent implementation
"""
import sys
import os


def setup_test_environment():
    """Set up mock environment variables for testing"""
    os.environ['OPENAI_API_KEY'] = 'test-key-12345'
    os.environ['ZEP_API_URL'] = 'http://localhost:8000'


def test_imports():
    """Test that all modules can be imported"""
    try:
        from config import Config
        print("✓ Config module imported successfully")
        return True
    except ImportError as e:
        print(f"✗ Failed to import Config: {e}")
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


def test_agent_class_structure():
    """Test that agent class has expected methods"""
    try:
        from agent import ZepOpenAIAgent
        
        # Check class attributes
        expected_methods = ['chat', 'clear_memory', 'get_memory_summary']
        for method in expected_methods:
            if not hasattr(ZepOpenAIAgent, method):
                print(f"✗ Missing method: {method}")
                return False
        
        print("✓ Agent class structure is correct")
        print(f"  - Methods: {', '.join(expected_methods)}")
        return True
    except Exception as e:
        print(f"✗ Agent class structure test failed: {e}")
        return False


def main():
    """Run all tests"""
    # Set up test environment first
    setup_test_environment()
    
    print("=== Running Basic Tests ===\n")
    
    results = []
    
    # Test 1: Imports
    print("Test 1: Module Imports")
    results.append(test_imports())
    print()
    
    # Test 2: Config
    print("Test 2: Configuration Validation")
    results.append(test_config_validation())
    print()
    
    # Test 3: Agent Structure
    print("Test 3: Agent Class Structure")
    results.append(test_agent_class_structure())
    print()
    
    # Summary
    passed = sum(results)
    total = len(results)
    print("=" * 40)
    print(f"Tests Passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All tests passed!")
        return 0
    else:
        print("✗ Some tests failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
