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
    try:
        result = subprocess.run(
            ["ollama", "run", "mistral", data.prompt],
            capture_output=True,
            text=True
        )
        response_text = result.stdout.strip()

        # Get first two sentences
        sentences = response_text.split(". ")
        short_response = ". ".join(sentences[:2]) + "." if len(sentences) > 1 else response_text

        return {"response": short_response}
    except Exception as e:
        return {"error": str(e)}
@app.get("/health")
def health_check():
    return {"status": "ok"}
