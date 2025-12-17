from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import json
import uvicorn

app = FastAPI()

class ChatRequest(BaseModel):
    thread_id: str
    input: dict

@app.post("/api/chat")
async def chat(request: ChatRequest):
    def generate():
        yield f"data: {json.dumps({'type': 'assistant.response', 'content': 'Hello from test server!'})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/")
async def root():
    return {"status": "Server running OK"}

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Test endpoint is working"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002, reload=False)