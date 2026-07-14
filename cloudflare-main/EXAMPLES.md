# API Usage Examples

This document provides practical examples of using the Cloudflare Workers API with D1 and AI Gateway.

## Table of Contents

1. [Health Check](#health-check)
2. [User Management](#user-management)
3. [Post Management](#post-management)
4. [AI Capabilities](#ai-capabilities)

---

## Health Check

### Check API Status

```bash
curl https://your-worker.workers.dev/
```

**Response:**
```json
{
  "status": "ok",
  "message": "Cloudflare Workers with D1 and AI Gateway",
  "endpoints": {
    "users": "/users",
    "posts": "/posts",
    "ai": "/ai"
  }
}
```

---

## User Management

### Create a New User

```bash
curl -X POST https://your-worker.workers.dev/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }'
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Users

```bash
curl https://your-worker.workers.dev/users
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "created_at": "2024-01-15T10:31:00.000Z"
    }
  ]
}
```

### Get User by ID

```bash
curl https://your-worker.workers.dev/users/1
```

### Update a User

```bash
curl -X PUT https://your-worker.workers.dev/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Williams",
    "email": "alice.w@example.com"
  }'
```

### Delete a User

```bash
curl -X DELETE https://your-worker.workers.dev/users/1
```

---

## Post Management

### Create a Post

```bash
curl -X POST https://your-worker.workers.dev/posts \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "title": "Getting Started with Cloudflare Workers",
    "content": "Cloudflare Workers is a powerful platform for building serverless applications..."
  }'
```

**Response:**
```json
{
  "post": {
    "id": 1,
    "user_id": 1,
    "title": "Getting Started with Cloudflare Workers",
    "content": "Cloudflare Workers is a powerful platform...",
    "created_at": "2024-01-15T10:35:00.000Z"
  }
}
```

### Get All Posts

```bash
curl https://your-worker.workers.dev/posts
```

### Get Posts by User

```bash
curl https://your-worker.workers.dev/posts?user_id=1
```

---

## AI Capabilities

### Text Generation

Generate text using AI (e.g., write a story, generate code, answer questions):

```bash
curl -X POST https://your-worker.workers.dev/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a short poem about the ocean",
    "user_id": 1
  }'
```

**Response:**
```json
{
  "response": {
    "response": "The ocean waves crash on the shore,\nA rhythm ancient, deep and more,\nWith secrets hidden in the blue,\nA world of wonder, fresh and new."
  }
}
```

#### With Custom Model

```bash
curl -X POST https://your-worker.workers.dev/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "model": "@cf/meta/llama-2-7b-chat-int8",
    "user_id": 1
  }'
```

### Text Classification

Classify text sentiment (positive, negative, neutral):

```bash
curl -X POST https://your-worker.workers.dev/ai/classify \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is an amazing product! I absolutely love it!"
  }'
```

**Response:**
```json
{
  "response": [
    {
      "label": "POSITIVE",
      "score": 0.9998
    }
  ]
}
```

### Generate Text Embeddings

Convert text to vector embeddings (useful for semantic search, similarity):

```bash
curl -X POST https://your-worker.workers.dev/ai/embeddings \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Cloudflare Workers with D1 database"
  }'
```

**Response:**
```json
{
  "response": {
    "shape": [1, 768],
    "data": [[0.123, -0.456, 0.789, ...]]
  }
}
```

#### Multiple Texts

```bash
curl -X POST https://your-worker.workers.dev/ai/embeddings \
  -H "Content-Type: application/json" \
  -d '{
    "text": [
      "First sentence to embed",
      "Second sentence to embed"
    ]
  }'
```

### Text Translation

Translate text between languages:

```bash
curl -X POST https://your-worker.workers.dev/ai/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you today?",
    "source_lang": "english",
    "target_lang": "spanish"
  }'
```

**Response:**
```json
{
  "response": {
    "translated_text": "Hola, ¿cómo estás hoy?"
  }
}
```

#### More Translation Examples

```bash
# English to French
curl -X POST https://your-worker.workers.dev/ai/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Good morning, everyone!",
    "source_lang": "english",
    "target_lang": "french"
  }'

# Spanish to German
curl -X POST https://your-worker.workers.dev/ai/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Buenos días",
    "source_lang": "spanish",
    "target_lang": "german"
  }'
```

### Text Summarization

Summarize long text into a shorter version:

```bash
curl -X POST https://your-worker.workers.dev/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Cloudflare Workers provides a serverless execution environment that allows you to create entirely new applications or augment existing ones without configuring or maintaining infrastructure. Your Worker runs on Cloudflare'\''s global cloud network, with compute distributed across hundreds of cities worldwide. This means your code runs close to your users, reducing latency and improving performance. Workers can handle millions of requests per second, automatically scaling based on demand.",
    "max_length": 50
  }'
```

**Response:**
```json
{
  "response": {
    "summary": "Cloudflare Workers is a serverless platform that runs on a global network, providing low latency and automatic scaling."
  }
}
```

### View AI Request History

Get a log of recent AI requests:

```bash
curl https://your-worker.workers.dev/ai/history?limit=5
```

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "user_id": 1,
      "model": "@cf/meta/llama-2-7b-chat-int8",
      "prompt": "Write a short poem about the ocean",
      "response": "{\"response\":\"...\"}",
      "tokens_used": 0,
      "created_at": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

---

## JavaScript/TypeScript Examples

### Using Fetch API

```javascript
// Create a user
async function createUser() {
  const response = await fetch('https://your-worker.workers.dev/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com'
    })
  });
  
  const data = await response.json();
  console.log('Created user:', data.user);
  return data.user;
}

// Generate text with AI
async function generateText(prompt) {
  const response = await fetch('https://your-worker.workers.dev/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      user_id: 1
    })
  });
  
  const data = await response.json();
  return data.response;
}

// Usage
const user = await createUser();
const aiResponse = await generateText('Write a haiku about coding');
console.log(aiResponse);
```

### Using Axios

```javascript
import axios from 'axios';

const API_BASE = 'https://your-worker.workers.dev';

// Create a post
async function createPost(userId, title, content) {
  try {
    const response = await axios.post(`${API_BASE}/posts`, {
      user_id: userId,
      title: title,
      content: content
    });
    return response.data.post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Classify text sentiment
async function classifyText(text) {
  try {
    const response = await axios.post(`${API_BASE}/ai/classify`, {
      text: text
    });
    return response.data.response;
  } catch (error) {
    console.error('Error classifying text:', error);
    throw error;
  }
}
```

### Python Example

```python
import requests
import json

API_BASE = 'https://your-worker.workers.dev'

# Create a user
def create_user(name, email):
    response = requests.post(
        f'{API_BASE}/users',
        json={'name': name, 'email': email}
    )
    return response.json()['user']

# Generate embeddings
def generate_embeddings(text):
    response = requests.post(
        f'{API_BASE}/ai/embeddings',
        json={'text': text}
    )
    return response.json()['response']

# Usage
user = create_user('Jane Doe', 'jane@example.com')
print(f"Created user: {user['id']}")

embeddings = generate_embeddings('Machine learning is fascinating')
print(f"Embedding shape: {embeddings['shape']}")
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Example error response:
```json
{
  "error": "User not found"
}
```

With detailed message:
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

---

## Rate Limiting

Be aware of Cloudflare Workers rate limits:
- Free tier: 100,000 requests/day
- Paid tier: Higher limits available

AI Gateway also has rate limits based on your Cloudflare plan.

---

## Best Practices

1. **Always validate user input** before making API calls
2. **Handle errors gracefully** with try-catch blocks
3. **Use environment variables** for the API base URL
4. **Cache responses** when appropriate to reduce API calls
5. **Monitor AI usage** through the `/ai/history` endpoint
6. **Use appropriate AI models** for your use case to optimize performance

---

## Support

For issues or questions:
- Check the [main README](README.md)
- Review the [Deployment Guide](DEPLOYMENT.md)
- Consult [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
