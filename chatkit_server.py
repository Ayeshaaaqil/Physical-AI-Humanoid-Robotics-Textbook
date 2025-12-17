from typing import Any, Generic, TypeVar, List
import os
from dotenv import load_dotenv
from pathlib import Path
import cohere
from qdrant_client import QdrantClient
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# ---------------- Logging ----------------
logging.basicConfig(level=logging.INFO)

# ---------------- Load Environment Variables ----------------
BASE_DIR = Path(__file__).resolve().parent
dotenv_path = BASE_DIR / ".env.local"

if not dotenv_path.exists():
    logging.error(".env.local file not found.")
    exit()

load_dotenv(dotenv_path)

cohere_api_key = os.getenv("COHERE_API_KEY")
qdrant_url = os.getenv("QDRANT_URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")

if not all([cohere_api_key, qdrant_url, qdrant_api_key]):
    logging.error("Missing environment variables.")
    exit()

# ---------------- Initialize Clients ----------------
cohere_client = cohere.Client(cohere_api_key)

qdrant_client = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_api_key,
    check_compatibility=False,
)

EMBED_MODEL = "embed-english-v3.0"
COLLECTION_NAME = "humanoid_ai_book"

T = TypeVar("T")

# ---------------- Store Classes ----------------
class Store:
    async def load_thread_items(self, thread_id, start_cursor, limit, order, context):
        return DummyPage()

    def generate_item_id(self, item_type, thread, context):
        return f"{item_type}-{hash(thread.id)}"

class ThreadMetadata:
    def __init__(self, id: str):
        self.id = id

class DummyPage(Generic[T]):
    def __init__(self):
        self.data: List[T] = []

# ---------------- Chat Server ----------------
class ChatKitServer(Generic[T]):
    def __init__(self, data_store: Store):
        self.store = data_store

    async def respond(self, thread: ThreadMetadata, input: Any, context: T):
        try:
            # Handle different input formats - if input is a dict with 'message', extract it
            if isinstance(input, dict) and 'message' in input:
                user_message = input['message']
            else:
                user_message = input

            # Ensure user_message is a string and not empty
            user_message = str(user_message) if user_message is not None else ""

            # Check if the message is empty and return an error if it is
            if not user_message.strip():
                yield {"type": "error", "content": "Cannot process empty message"}
                return

            # 1️⃣ Embed query
            logging.info("Embedding user message...")
            embed_response = cohere_client.embed(
                texts=[user_message],
                model=EMBED_MODEL,
                input_type="search_query",
            )
            query_embedding = embed_response.embeddings[0]

            # 2️⃣ Search Qdrant
            logging.info("Searching Qdrant...")
            results = qdrant_client.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_embedding,
                limit=5,
            )

            documents = []
            for hit in results:
                documents.append({
                    "title": hit.payload.get("url", "") if hit.payload else "",
                    "snippet": hit.payload.get("text", "") if hit.payload else "",
                    "id": str(hit.id),
                })

            # 3️⃣ Chat completion
            logging.info("Generating chat response...")
            chat_response = cohere_client.chat(
                message=user_message,
                documents=documents,
                stream=False,
            )

            yield {
                "type": "assistant.response",
                "content": chat_response.text,
            }

        except Exception as e:
            logging.error(f"Respond error: {e}")
            yield {"type": "error", "content": str(e)}

# ---------------- FastAPI App ----------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/favicon.ico")
async def favicon():
    return FileResponse("favicon.ico")

@app.get("/")
async def health():
    return {"status": "OK"}

@app.post("/api/chat")
async def chat_endpoint(request: Request):
    body = await request.json()
    message = body.get("message", "")
    thread_id = body.get("thread_id", "default")

    server = ChatKitServer(Store())
    events = []

    async for event in server.respond(ThreadMetadata(thread_id), message, None):
        events.append(event)

    return {"events": events}
