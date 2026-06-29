# Quick Start Guide - OpenAI and Zep Agent

## Installation (2 steps)

```bash
pip install -r requirements.txt
cp .env.example .env  # Then edit with your API keys
```

## Minimal Example

```python
from agent import ZepOpenAIAgent
import uuid

# Create agent
session_id = str(uuid.uuid4())
agent = ZepOpenAIAgent(session_id=session_id)

# Chat
response = agent.chat("Hello! How are you?")
print(response)
```

## Configuration (.env file)

```
OPENAI_API_KEY=sk-...           # Required
ZEP_API_URL=http://localhost:8000  # Default
ZEP_API_KEY=...                    # Optional
```

## Common Operations

```python
# Custom system prompt
agent.system_prompt = "You are a helpful coding assistant."

# Chat without history
response = agent.chat("What is Python?", use_history=False)

# Clear memory
agent.clear_memory()

# Get summary
summary = agent.get_memory_summary()
```

## Running Examples

```bash
python example.py              # Interactive demo
python examples_advanced.py    # Advanced features
python test_agent.py          # Run tests
```

## Zep Setup (Optional - for local development)

```bash
docker run -d -p 8000:8000 ghcr.io/getzep/zep:latest
```

## Project Structure

```
.
├── agent.py              # Main agent implementation
├── config.py             # Configuration
├── example.py            # Interactive demo
├── examples_advanced.py  # Advanced usage
├── test_agent.py         # Tests
├── requirements.txt      # Dependencies
├── .env.example          # Config template
├── README.md             # Full documentation
└── ARCHITECTURE.md       # System architecture
```

## Key Features

✅ OpenAI GPT integration
✅ Persistent memory with Zep
✅ Session management
✅ Customizable prompts
✅ Multiple sessions support
✅ Memory summarization
✅ Error handling

## Support

- Full documentation: README.md
- Architecture: ARCHITECTURE.md
- Examples: example.py, examples_advanced.py
