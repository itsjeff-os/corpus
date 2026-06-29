# Systems

An intelligent agent system that combines OpenAI's powerful language models with Zep's memory management for persistent, context-aware conversations. Now with **conversational graph** support and **dynamic context handling**!

## Features

### Base Agent (ZepOpenAIAgent)
- **OpenAI Integration**: Leverages OpenAI's GPT models for natural language understanding and generation
- **Zep Memory Management**: Persistent conversation memory with automatic summarization
- **Session Management**: Support for multiple concurrent conversation sessions
- **Flexible Configuration**: Easy customization through environment variables
- **Graceful Degradation**: Works without Zep if unavailable
- **Robust Error Handling**: Specific exception handling and sanitized error messages
- **Input Validation**: Validates session IDs and user messages

### Enhanced Agent (EnhancedZepOpenAIAgent) 🆕
- **Conversational Graph**: Track conversations as a tree structure with parent-child relationships
- **Branching Conversations**: Support multiple conversation paths from the same starting point
- **Dynamic Context Management**: Smart token-aware context window selection
- **Relevance-Based Retrieval**: Automatically fetch relevant historical context based on current query
- **Token Counting**: Precise token management using tiktoken
- **Context Optimization**: Fits maximum relevant context within model limits
- **Conversation Analytics**: Get stats on graph structure and conversation flow

## Prerequisites

- Python 3.8 or higher
- OpenAI API key
- Zep server (optional, can run locally or use cloud instance)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dho1GH/Systems.git
cd Systems
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
ZEP_API_URL=http://localhost:8000
ZEP_API_KEY=your_zep_api_key_here  # Optional, depending on your Zep setup
```

## Quick Start

### Running the Example

```bash
python example.py
```

This will start an interactive chat session where you can:
- Chat with the AI agent
- Type `quit` to exit
- Type `clear` to clear conversation memory
- Type `summary` to see a summary of the conversation

### Using the Agent in Your Code

#### Basic Agent
```python
from agent import ZepOpenAIAgent
import uuid

# Create a new agent instance
session_id = str(uuid.uuid4())
agent = ZepOpenAIAgent(session_id=session_id, user_id="user123")

# Send a message
response = agent.chat("Hello, how are you?")
print(response)

# Continue the conversation (with memory)
response = agent.chat("What did I just ask you?")
print(response)

# Clear conversation memory
agent.clear_memory()
```

#### Enhanced Agent with Graph and Dynamic Context 🆕
```python
from agent_enhanced import EnhancedZepOpenAIAgent
import uuid

# Create enhanced agent with graph tracking
agent = EnhancedZepOpenAIAgent(
    session_id=str(uuid.uuid4()),
    enable_graph=True
)

# Chat with automatic graph tracking
response = agent.chat("Tell me about Python")
response = agent.chat("What about JavaScript?")

# Use dynamic context selection
response = agent.chat(
    "Can you compare both languages?",
    use_history=True,
    use_dynamic_context=True  # Smart context selection
)

# Get conversation analytics
stats = agent.get_graph_stats()
print(f"Total messages: {stats['total_nodes']}")
print(f"Conversation branches: {stats['total_branches']}")

# Navigate branches
branches = agent.get_conversation_branches()
if branches:
    agent.switch_branch(branches[0][0])  # Switch to first branch
```

See `example_enhanced.py` for more advanced usage examples.

## Architecture

### Components

1. **config.py**: Configuration management using environment variables
2. **agent.py**: Base agent implementation with OpenAI and Zep integration
3. **agent_enhanced.py**: Enhanced agent with graph and dynamic context features
4. **example.py**: Interactive demo application
5. **example_enhanced.py**: Advanced examples showcasing new features
6. **test_enhanced.py**: Comprehensive test suite with mocking

### Base Agent Flow

1. **User Input**: The user sends a message to the agent
2. **Memory Retrieval**: The agent retrieves conversation history from Zep
3. **OpenAI Processing**: The message and history are sent to OpenAI's API
4. **Response Generation**: OpenAI generates a contextually relevant response
5. **Memory Storage**: The conversation turn is saved to Zep for future reference

### Enhanced Agent Flow (New!) 🆕

1. **User Input**: User sends a message
2. **Graph Node Creation**: Message is added as a node in the conversation graph
3. **Context Selection**: 
   - Retrieves full conversation history from Zep
   - Gets relevant nodes from conversation graph based on query
   - Uses DynamicContextManager to select optimal messages within token budget
4. **OpenAI Processing**: Selected context sent to OpenAI API
5. **Response & Graph Update**:
   - Response generated by OpenAI
   - Response added as child node in conversation graph
   - Both user message and response saved to Zep
6. **Analytics**: Graph statistics updated for conversation tracking

### Key Enhancements

**Conversational Graph**:
- Each message is a node with metadata (role, content, timestamp, topics)
- Nodes connected via parent-child relationships
- Support for multiple branches from any node
- Navigate conversation history as a tree structure
- Relevance-based node retrieval

**Dynamic Context Management**:
- Token counting using tiktoken
- Automatic context window optimization
- Prioritizes recent and relevant messages
- Ensures responses fit within model limits
- Handles large conversation histories efficiently

## Configuration Options

The following environment variables can be set in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| OPENAI_API_KEY | Your OpenAI API key | Required |
| OPENAI_MODEL | OpenAI model to use | gpt-4 |
| ZEP_API_URL | URL of your Zep server | http://localhost:8000 |
| ZEP_API_KEY | Zep API key (if required) | None |
| AGENT_NAME | Name of the agent | Assistant |
| MAX_TOKENS | Maximum tokens in response | 2000 |
| TEMPERATURE | Response randomness (0-1) | 0.7 |

## Setting Up Zep

### Option 1: Local Docker Instance

```bash
docker run -d -p 8000:8000 ghcr.io/getzep/zep:latest
```

### Option 2: Zep Cloud

Sign up at [getzep.com](https://www.getzep.com) and use the provided API URL and key.

## Advanced Usage

### Custom System Prompt

```python
agent = ZepOpenAIAgent(session_id=session_id)
agent.system_prompt = "You are a helpful coding assistant specializing in Python."
```

### Using Without History

```python
# One-off question without conversation context
response = agent.chat("What is Python?", use_history=False)
```

### Getting Memory Summary

```python
summary = agent.get_memory_summary()
if summary:
    print(f"Conversation summary: {summary}")
```

## Troubleshooting

### "OPENAI_API_KEY is required"
Make sure you've created a `.env` file and added your OpenAI API key.

### "Could not retrieve memory from Zep"
- Check that your Zep server is running
- Verify the `ZEP_API_URL` is correct
- If using Zep Cloud, ensure `ZEP_API_KEY` is set

### Connection Issues
- Ensure you have an active internet connection
- Check that API keys are valid and not expired
- Verify firewall settings aren't blocking the connections

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Zep Documentation](https://docs.getzep.com)
- [Python dotenv](https://github.com/theskumar/python-dotenv)