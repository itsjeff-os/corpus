

from src.orchestrator import Orchestrator

if __name__ == "__main__":
    orch = Orchestrator()
    text = "95% of .env files contain secrets. Rotate keys immediately."
    output, results = orch.verify_response(text)
    print("Original:", text)
    print("Processed:", output)
    print("Verification:", results)
