import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from chatkit import Chat,
    ChatParticipant,
    ChatUser,
    ChatkitAgent,
    ChatkitAgentInboundMessage,
    KnowledgeBaseTool,
    ToolDefinition
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import Qdrant

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not all([OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY]):
    raise ValueError("Missing one or more environment variables: OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY")

# Initialize OpenAI client for ChatKit
client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Qdrant as a knowledge base
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model="text-embedding-3-small")
qdrant_client = Qdrant(client=None, embeddings=embeddings, url=QDRANT_URL, api_key=QDRANT_API_KEY, collection_name="docusaurus_rag")

# Define the RAG tool
rag_tool = KnowledgeBaseTool(
    name="docusaurus_rag_tool",
    description="A tool for retrieving information from the Docusaurus documentation about humanoid robotics.",
    knowledge_base=qdrant_client,
    fields=["page_content", "source"],
)

# Initialize ChatKit Agent
chatkit_agent = ChatkitAgent(
    name="DocusaurusRAGAgent",
    instructions=(
        "You are an AI assistant for the Docusaurus book on humanoid robotics. "
        "Answer questions based *only* on the provided context from the Docusaurus documentation. "
        "If the answer is not in the documentation, state that you don't know. "
        "Prioritize information from 'selected_text' if available. "
        "If the user asks about something specific, try to use the `docusaurus_rag_tool` to find relevant information. "
    ),
    tools=[rag_tool],
    model="gpt-4o",
    client=client,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  # Allow your Docusaurus frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    user_message = data.get("message")
    conversation_id = data.get("conversation_id")
    selected_text = data.get("selected_text")  # Get selected text from frontend

    # Prepare inbound message with selected_text as additional context
    inbound_message = ChatkitAgentInboundMessage(
        text=user_message,
        context={
            "selected_text": selected_text
        } if selected_text else None
    )

    # Generate agent response
    agent_response = await chatkit_agent.generate_response(inbound_message=inbound_message, conversation_id=conversation_id)

    # Return the response to the frontend
    return {"text": agent_response.text, "conversation_id": agent_response.conversation_id}

