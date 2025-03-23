from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Chatbot Backend is running!"}

@app.post("/chat/")
def chat_with_mistral(prompt: str):
    try:
        result = subprocess.run(
            ["ollama", "run", "mistral", prompt],
            capture_output=True,
            text=True
        )
        response_text = result.stdout.strip()

        # Extract only the first 2 sentences for conciseness
        sentences = response_text.split(". ")
        short_response = ". ".join(sentences[:2]) + "." if len(sentences) > 1 else response_text

        return {"response": short_response}
    except Exception as e:
        return {"error": str(e)}
