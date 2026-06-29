"""
OpenAI and Zep Agent Configuration
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration class for the agent"""
    
    # OpenAI settings
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")
    
    # Zep settings
    ZEP_API_URL = os.getenv("ZEP_API_URL", "http://localhost:8000")
    ZEP_API_KEY = os.getenv("ZEP_API_KEY")
    
    # Agent settings
    AGENT_NAME = os.getenv("AGENT_NAME", "Assistant")
    MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2000"))
    TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
    
    @classmethod
    def validate(cls):
        """Validate required configuration"""
        if not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required")
        return True
