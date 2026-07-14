import argparse
import asyncio
import json
import os
from typing import Any

from fastapi import FastAPI

from .agent import compile_intent
from .models import CompileIntentRequest, CompileIntentResponse


app = FastAPI(title="OpenAI Intent Runtime")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "openai-intent-runtime"}


@app.post("/intent")
async def intent(request: CompileIntentRequest) -> CompileIntentResponse:
    compiled = await compile_intent(request)
    return CompileIntentResponse(input=request, intent=compiled)


async def run_compile(args: argparse.Namespace) -> dict[str, Any]:
    request = CompileIntentRequest(
        text=args.text,
        project=args.project,
        mode_hint=args.mode_hint,
    )
    compiled = await compile_intent(request)
    return CompileIntentResponse(input=request, intent=compiled).model_dump()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="intent-runtime",
        description="Compile conversation into structured operational intent.",
    )
    subparsers = parser.add_subparsers(dest="command")
    compile_parser = subparsers.add_parser("compile")
    compile_parser.add_argument("text")
    compile_parser.add_argument("--project")
    compile_parser.add_argument("--mode-hint")
    return parser


def main() -> None:
    if os.environ.get("PORT"):
        import uvicorn

        uvicorn.run(
            "intent_runtime.main:app",
            host=os.environ.get("HOST", "0.0.0.0"),
            port=int(os.environ["PORT"]),
        )
        return

    parser = build_parser()
    args = parser.parse_args()
    if args.command == "compile":
        output = asyncio.run(run_compile(args))
        print(json.dumps(output, indent=2))
        return
    parser.print_help()


if __name__ == "__main__":
    main()

