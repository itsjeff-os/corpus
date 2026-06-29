import io
import os
from pathlib import Path

from dotenv import load_dotenv
from mcp.server.fastmcp.server import FastMCP

from config.db import init_db

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")
init_db()

from app_agents.controller import get_agent, handle_chat
from memory.zep import get_last_messages, memory_status

MCP_HOST = os.getenv("MCP_HOST", "127.0.0.1")
MCP_PORT = int(os.getenv("MCP_PORT", "8765"))
MCP_TRANSPORT = os.getenv("MCP_TRANSPORT", "stdio")

mcp = FastMCP(
    name="gpt-assistant",
    instructions="Tools for chatting with a persistent assistant, memory, and ingestion.",
    host=MCP_HOST,
    port=MCP_PORT,
)


@mcp.tool()
def chat(input: str, user_id: str = "default", thread_id: str | None = None) -> dict:
    """Send a message to the assistant."""
    payload = {"user_id": user_id, "input": input}
    if thread_id:
        payload["thread_id"] = thread_id
    return handle_chat(payload)


@mcp.tool()
def memory(user_id: str = "default", limit: int = 10) -> dict:
    """Fetch recent memory entries."""
    return {"user_id": user_id, "messages": get_last_messages(user_id=user_id, limit=limit)}


@mcp.tool()
def memory_runtime() -> dict:
    """Report which memory backend is configured."""
    return memory_status()


@mcp.tool()
def conversation_new(user_id: str = "default") -> dict:
    """Start a new OpenAI conversation thread."""
    agent = get_agent()
    conv_id = agent.new_conversation(user_id)
    return {"conversation_id": conv_id}


@mcp.tool()
def ingest_path(path: str, filename: str | None = None) -> dict:
    """Upload a local file into the OpenAI vector store."""
    if not os.path.isfile(path):
        raise FileNotFoundError(path)
    name = filename or os.path.basename(path)
    agent = get_agent()
    with open(path, "rb") as handle:
        result = agent.ingest_file(handle, name)
    return {"vector_store_id": agent.get_vector_store_id(), **result}


@mcp.tool()
def ingest_text(filename: str, content: str) -> dict:
    """Upload text content into the OpenAI vector store."""
    agent = get_agent()
    data = io.BytesIO(content.encode("utf-8"))
    result = agent.ingest_file(data, filename)
    return {"vector_store_id": agent.get_vector_store_id(), **result}


if __name__ == "__main__":
    mcp.run(transport=MCP_TRANSPORT)
