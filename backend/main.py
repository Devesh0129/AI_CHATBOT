from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://127.0.0.1:11434/api/generate")
OLLAMA_MODEL = "mistral"

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request body model
class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
def read_root():
    return {"message": "AI Chatbot Backend is running!"}

@app.post("/chat/")
def chat_with_mistral(data: PromptRequest):
    prompt = (data.prompt or "").strip()
    if not prompt:
        return {"error": "Prompt cannot be empty."}

    try:
        request_body = json.dumps({
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "keep_alive": "10m",
        }).encode("utf-8")
        request = Request(
            OLLAMA_API_URL,
            data=request_body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        with urlopen(request, timeout=120) as response:
            result = json.loads(response.read().decode("utf-8"))

        response_text = (result.get("response") or "").strip()
        if not response_text:
            return {"error": "Ollama returned an empty response."}

        sentences = [sentence.strip() for sentence in response_text.split(". ") if sentence.strip()]
        if len(sentences) > 1:
            short_response = ". ".join(sentences[:2]).rstrip(".") + "."
        else:
            short_response = response_text.rstrip(".")
            if not short_response.endswith("."):
                short_response += "."

        return {"response": short_response}
    except TimeoutError:
        return {"error": "The AI model took too long to respond. Please try a shorter prompt."}
    except HTTPError as error:
        return {"error": f"Ollama returned HTTP {error.code}."}
    except URLError:
        return {"error": "Could not connect to Ollama. Make sure Ollama is running."}
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {"error": "Ollama returned an invalid response."}

@app.get("/health")
def health_check():
    return {"status": "ok"}
