from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from chatkit_server import ChatKitServer, Store, ThreadMetadata
from pydantic import BaseModel
from typing import Any, AsyncIterator

app = FastAPI()

# Add CORS middleware to allow requests from local Docusaurus instance
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for the request body
class ChatRequest(BaseModel):
    thread_id: str
    input: Any

# Initialize the ChatKitServer with a dummy store
# You might want to replace this with a proper store implementation
chat_store = Store()
chat_server = ChatKitServer(chat_store)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    # In a real application, you would parse the input and
    # use it to interact with the chat_server.
    # For now, we'll just use a dummy response.
    thread_metadata = ThreadMetadata(id=request.thread_id)

    # Extract message from input if it's in the expected format
    user_message = request.input
    if isinstance(request.input, dict) and 'message' in request.input:
        user_message = request.input['message']

    response_generator = chat_server.respond(thread_metadata, user_message, None) # Context is None for now

    responses = []
    async for res in response_generator:
        responses.append(res)

    # Ensure we return at least a basic response
    if not responses:
        responses = [{"type": "assistant.response", "content": "Hello! I'm your Physical AI & Humanoid Robotics assistant. How can I help you today?"}]

    return responses

@app.get("/")
async def root():
    return {"message": "ChatKit Backend is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)