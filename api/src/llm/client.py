import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-20b")

if not API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set")


client = OpenAI(
    api_key=API_KEY,
    base_url="https://api.groq.com/openai/v1",
)


def generate(
    prompt: str,
    model: str = LLM_MODEL,
) -> str:
    response = client.responses.create(
        model=model,
        input=prompt,
    )

    return response.output_text
