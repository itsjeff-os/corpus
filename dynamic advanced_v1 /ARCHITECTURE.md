# OpenAI and Zep Agent - Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────┐
│                     User Application                     │
│                     (example.py)                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ Uses
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  ZepOpenAIAgent                         │
│                   (agent.py)                            │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │ • Manages conversation sessions                 │   │
│  │ • Coordinates between OpenAI and Zep           │   │
│  │ • Handles message history                       │   │
│  └────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────┬──────────────────┘
           │                          │
           │ Calls                    │ Calls
           ▼                          ▼
┌──────────────────────┐    ┌─────────────────────┐
│    OpenAI API        │    │    Zep Service      │
│                      │    │                     │
│  • GPT Models        │    │  • Memory Storage   │
│  • Chat Completion   │    │  • Summarization    │
│  • Token Management  │    │  • Search           │
└──────────────────────┘    └─────────────────────┘
```

## Data Flow

### 1. User Sends Message
```
User Input → Agent.chat()
```

### 2. Retrieve Conversation History
```
Agent → Zep.memory.get(session_id) → Historical Messages
```

### 3. Build Context
```
System Prompt + History + Current Message → OpenAI Context
```

### 4. Generate Response
```
OpenAI Context → GPT Model → Assistant Response
```

### 5. Store in Memory
```
User Message + Assistant Response → Zep.memory.add(session_id)
```

### 6. Return to User
```
Assistant Response → User
```

## Key Features

### Memory Management (Zep)
- **Session-based**: Each conversation has a unique session ID
- **Persistent**: Messages survive application restarts
- **Automatic Summarization**: Zep can generate summaries of long conversations
- **Search**: Can search through historical conversations
- **Facts**: Extracts and stores key facts from conversations

### Language Processing (OpenAI)
- **Context-aware**: Uses full conversation history
- **Configurable**: Model, temperature, and tokens are adjustable
- **Reliable**: Uses OpenAI's production-grade API
- **Flexible**: Can work with different GPT models

## Configuration Options

| Component | Configuration | Purpose |
|-----------|---------------|---------|
| OpenAI | OPENAI_API_KEY | Authentication |
| OpenAI | OPENAI_MODEL | Model selection (gpt-4, gpt-3.5-turbo, etc.) |
| OpenAI | MAX_TOKENS | Response length limit |
| OpenAI | TEMPERATURE | Creativity level (0-1) |
| Zep | ZEP_API_URL | Server location |
| Zep | ZEP_API_KEY | Authentication (if required) |
| Agent | AGENT_NAME | System identity |

## Error Handling

The agent implements graceful degradation:

1. **Zep Unavailable**: Agent continues working but without memory persistence
2. **OpenAI Error**: Returns error message to user
3. **Invalid Config**: Fails fast with clear error message

## Extension Points

### Custom System Prompts
```python
agent = ZepOpenAIAgent(session_id=session_id)
agent.system_prompt = "You are a helpful Python coding assistant."
```

### Memory-less Mode
```python
response = agent.chat("Question", use_history=False)
```

### Manual Memory Management
```python
agent.clear_memory()  # Clear conversation history
summary = agent.get_memory_summary()  # Get summary
```

## Security Considerations

1. **API Keys**: Never commit `.env` file (use `.env.example` as template)
2. **Input Validation**: Implement application-level validation as needed
3. **Rate Limiting**: Consider implementing rate limiting for production use
4. **Data Privacy**: Be aware of where conversation data is stored (OpenAI, Zep)

## Performance Optimization

1. **Token Management**: Monitor token usage to control costs
2. **History Limits**: Use `lastn` parameter in `memory.get()` to limit history
3. **Caching**: Consider caching responses for identical queries
4. **Async**: For high-throughput, consider async implementations

## Future Enhancements

- [ ] Add support for function calling
- [ ] Implement streaming responses
- [ ] Add multi-modal support (images, audio)
- [ ] Implement conversation branching
- [ ] Add analytics and monitoring
- [ ] Support for multiple agents in same session
- [ ] Add conversation export/import
