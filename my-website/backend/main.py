import os
import json
from typing import Any, AsyncIterator, Dict, List, Optional

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
import openai
from dotenv import load_dotenv

from agents import Tool, AgentContext, Agent, Runner, stream_agent_response, AssistantMessageItem
from chatkit_server import ChatKitServer, Store, ThreadMetadata, ThreadItemConverter

load_dotenv()

# ==== QDRANT SETUP ====
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)
collection_name = os.getenv("QDRANT_COLLECTION_NAME", "book_rag_collection")
openai.api_key = os.getenv("OPENAI_API_KEY")

gemini_model = "gemini-pro" # Or your preferred Gemini model

# ==== RAG RETRIEVAL TOOL FOR AGENT ====
async def retrieve_from_book(query: str, selected_text: str = "") -> str:
    """Retrieve relevant chunks from Qdrant (book content)"""
    embedding = openai.embeddings.create(
        input=query + " " + selected_text,
        model="text-embedding-3-small"
    ).data[0].embedding

    search_result = qdrant_client.search(
        collection_name=collection_name,
        query_vector=embedding,
        limit=5,
        with_payload=True
    )

    context = "Book Context:\n\n"
    for hit in search_result:
        context += hit.payload.get("text", "") + "\n\n"

    if selected_text:
        context = f"User selected this text from the book:\n\"\"\"\n{selected_text}\n\"\"\"\n\n" + context

    return context

# ==== UPDATED AGENT WITH RAG TOOL ====
rag_tool = Tool(
    name="retrieve_book_content",
    description="Retrieve relevant sections from the book to answer user questions accurately. Always use this when asked about book content.",
    parameters={
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "The user's question or topic"},
            "selected_text": {"type": "string", "description": "Text user highlighted (if any)"}
        },
        "required": ["query"]
    },
    handler=lambda query, selected_text="": retrieve_from_book(query, selected_text)
)

class GeminiChatKitServer(ChatKitServer[Dict[str, Any]]):
    def __init__(self, data_store: Store):
        super().__init__(data_store)
        self.assistant_agent = Agent[AgentContext](
            name="Book RAG Assistant",
            instructions="""
            You are an expert assistant for a technical book.
            Always use the 'retrieve_book_content' tool to get accurate information from the book.
            If user highlights any text (selected_text), give priority to that.
            Answer in clear, professional Urdu/English mix if user asks in Urdu.
            Never make up information — only use retrieved context.
            """,
            model=gemini_model,
            tools=[rag_tool]
        )
        self.converter = ThreadItemConverter()

    async def respond(self, thread: ThreadMetadata, input: Any, context: Dict[str, Any]) -> AsyncIterator:
        selected_text = context.get("selected_text", "")

        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )

        page = await self.store.load_thread_items(thread.id, None, 100, "asc", context)
        all_items = list(page.data)
        if input:
            all_items.append(input)

        agent_input = await self.converter.to_agent_input(all_items) if all_items else []

        if selected_text:
            agent_input.append({
                "role": "system",
                "content": f"User highlighted this text:\n{selected_text}"
            })

        result = Runner.run_streamed(
            self.assistant_agent,
            agent_input,
            context=agent_context,
        )

        id_mapping: Dict[str, str] = {}
        async for event in stream_agent_response(agent_context, result):
            if event.type == "thread.item.added":
                if isinstance(event.item, AssistantMessageItem):
                    old_id = event.item.id
                    if old_id not in id_mapping:
                        new_id = self.store.generate_item_id("message", thread, context)
                        id_mapping[old_id] = new_id
                    event.item.id = id_mapping[old_id]
            yield event

class DummyStore(Store):
    async def load_thread_items(self, thread_id, start_cursor, limit, order, context):
        # Dummy implementation for now
        return DummyPage()

    def generate_item_id(self, item_type, thread, context):
        # Dummy implementation for now
        return f"{item_type}-{thread.id}-{hash(frozenset(context.items()))}"

class InputQuery(BaseModel):
    query: str
    selected_text: Optional[str] = None
    thread_id: Optional[str] = None

app = FastAPI()

origins = [
    "http://localhost:3000",  # Docusaurus frontend
    # Add your deployed Docusaurus site URL here, e.g., "https://your-robotics-curriculum.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query_chatbot(input_query: InputQuery):
    # For simplicity, creating a dummy thread and store for each request
    # In a real application, you would manage threads and stores persistently
    store = DummyStore()
    thread = ThreadMetadata(id=input_query.thread_id or "dummy_thread")

    chat_server = GeminiChatKitServer(store)

    # The input to the respond method should be in the format expected by ChatKitServer
    # Assuming a simple dictionary for now
    agent_input = {"role": "user", "content": input_query.query}
    context = {"selected_text": input_query.selected_text}

    response_stream = chat_server.respond(thread, agent_input, context)

    # Collect all responses from the stream and return them as a list
    responses = []
    async for event in response_stream:
        responses.append(event)

    return {"response": responses}
