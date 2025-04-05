# 🤖 AI Chatbot - FastAPI + React + Docker

This is a local AI-powered chatbot built using React.js for the frontend and FastAPI for the backend. 
It uses Ollama's Mistral model to generate AI responses and is fully containerized with Docker for easy setup and consistent development environments.

---

## Tech Stack

- Frontend: React.js + Vite
- Backend: FastAPI
- AI Model: Mistral via [Ollama](https://ollama.com/)
- DevOps: Docker, Docker Compose


## 🛠 Prerequisites

Make sure the following are installed on your system:

- [Docker](https://www.docker.com/)
- [Ollama](https://ollama.com/)
- Pull the Mistral model:
  
  ```bash
  ollama pull mistral


🚀 Getting Started

Clone the repository:

git clone https://github.com/yourusername/ai-chatbot-docker.git

cd ai-chatbot-docker

Start the app using Docker Compose:

docker-compose up --build

Open your browser:

Frontend: http://localhost:5173

Backend: http://localhost:8000


📡 API Endpoint

POST /chat/?prompt=your-question

Example:

http://localhost:8000/chat/?prompt=TellMeAFunfact

Response:

{
  "response": "Here’s a fun fact: Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat."
}


💬 Features

Clean chat UI with user and bot messages

Persistent local chat history

Dockerized for easy local development

AI answers powered by Mistral via Ollama


🧹 Reset Chat

Click the Clear Chat button in the frontend to reset the conversation and clear saved messages from local storage.

❗ Notes

Ollama must be running in the background locally for the AI to respond.


👤 Author

Devesh Talsania
