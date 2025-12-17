from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import logging
from database import get_db
from sqlalchemy.orm import Session
from agents import run_rag_chat
from utils import retrieve, retrieve_with_user_context, add_user_provided_text_to_context
import uuid
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RAG Chatbot API", version="1.0.0")

# Add CORS middleware to allow requests from local Docusaurus instance
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    thread_id: str
    input: str
    user_text: Optional[str] = ""  # Allow users to provide their own text context
    top_k: Optional[int] = 5

class QueryRequest(BaseModel):
    query: str
    user_text: Optional[str] = ""
    top_k: Optional[int] = 5

class HealthResponse(BaseModel):
    status: str
    service: str

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy", service="RAG Chatbot API")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "RAG Chatbot API is running"}

# Query endpoint that works with the test
@app.post("/query")
async def query_endpoint(request: QueryRequest):
    """Main query endpoint that handles RAG-based questions"""
    try:
        logger.info(f"Received query: {request.query}")

        # Determine the context based on whether user provided their own text
        if request.user_text:
            # Use user-provided text as context
            response_text = retrieve_with_user_context(
                user_text=request.user_text,
                query=request.query,
                top_k=request.top_k
            )
        else:
            # Use only the book content for context
            response_text = retrieve(request.query, request.top_k)

        return {
            "query": request.query,
            "response": response_text,
            "user_text": request.user_text,
            "top_k": request.top_k,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Enhanced chat endpoint that uses the RAG system
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """Chat endpoint using the RAG system with database integration"""
    try:
        logger.info(f"Received chat request for thread: {request.thread_id}")

        # Check if thread exists, if not create it
        from database import Conversation, Message
        conversation = db.query(Conversation).filter(Conversation.thread_id == request.thread_id).first()
        if not conversation:
            conversation = Conversation(
                thread_id=request.thread_id,
                title=f"Conversation {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # Save user message to database
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.input
        )
        db.add(user_message)
        db.commit()

        # Run RAG chat with context
        response = run_rag_chat(request.input, request.user_text)

        # Save assistant response to database
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response
        )
        db.add(assistant_message)
        db.commit()

        return {
            "thread_id": request.thread_id,
            "input": request.input,
            "response": response,
            "user_text": request.user_text,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        logger.error(f"Error processing chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)