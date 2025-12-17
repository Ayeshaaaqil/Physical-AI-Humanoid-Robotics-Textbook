from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from chatkit_server import ChatKitServer, Store, ThreadMetadata
from pydantic import BaseModel
from typing import Any, AsyncIterator
from fastapi.responses import StreamingResponse
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
try:
    chat_store = Store()
    chat_server = ChatKitServer(chat_store)
    logger.info("ChatKitServer initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize ChatKitServer: {e}")
    raise

@app.post("/api/chat")
async def chat(request: ChatRequest):
    logger.info(f"Received chat request: {request}")

    # In a real application, you would parse the input and
    # use it to interact with the chat_server.
    # For now, we'll just use a dummy response.
    thread_metadata = ThreadMetadata(id=request.thread_id)

    # Extract message from input if it's in the expected format
    user_message = request.input
    if isinstance(request.input, dict) and 'message' in request.input:
        user_message = request.input['message']

    try:
        response_generator = chat_server.respond(thread_metadata, user_message, None) # Context is None for now
    except Exception as e:
        logger.error(f"Error calling chat_server.respond: {e}")
        raise

    async def stream_responses():
        try:
            async for res in response_generator:
                logger.info(f"Yielding response: {res}")
                yield f"data: {json.dumps(res)}\n\n"
        except Exception as e:
            logger.error(f"Error in stream_responses: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(stream_responses(), media_type="text/event-stream")

@app.get("/")
async def root():
    return {"status": "Server running OK"}

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Test endpoint is working"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002)