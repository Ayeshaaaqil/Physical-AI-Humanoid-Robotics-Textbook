from fastapi import FastAPI
import uvicorn
from .chatkit_server import ChatKitServer, Store, ThreadMetadata
from pydantic import BaseModel
from typing import Any, AsyncIterator

app = FastAPI()

# Pydantic model for the request body
class ChatRequest(BaseModel):
    thread_id: str
    input: Any

# Initialize the ChatKitServer with a dummy store
# You might want to replace this with a proper store implementation
chat_store = Store()
chat_server = ChatKitServer(chat_store)

@app.post("/chat")
async def chat(request: ChatRequest):
    # In a real application, you would parse the input and
    # use it to interact with the chat_server.
    # For now, we'll just use a dummy response.
    thread_metadata = ThreadMetadata(id=request.thread_id)
    response_generator = chat_server.respond(thread_metadata, request.input, None) # Context is None for now
    
    responses = []
    async for res in response_generator:
        responses.append(res)
    return responses

@app.get("/")
async def root():
    return {"message": "ChatKit Backend is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)