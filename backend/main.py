from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess

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
        result = subprocess.run(
            ["ollama", "run", "mistral", prompt],
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
        )

        if result.returncode != 0:
            stderr = (result.stderr or "").strip()
            return {"error": stderr or "Ollama model call failed."}

        response_text = (result.stdout or "").strip()
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
    except subprocess.TimeoutExpired:
        return {"error": "The AI model took too long to respond. Please try a shorter prompt."}
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
def health_check():
    return {"status": "ok"}
