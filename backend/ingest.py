# ingest.py
import os
from pathlib import Path
from dotenv import load_dotenv

# LangChain imports
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore

# Load .env from project root (2 levels up from backend/ingest.py)
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / ".env")  # <-- Yeh bilkul safe aur correct hai

# Get secrets securely from .env
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# Validation with helpful message
if not all([OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY]):
    missing = [key for key, val in {
        "OPENAI_API_KEY": OPENAI_API_KEY,
        "QDRANT_URL": QDRANT_URL,
        "QDRANT_API_KEY": QDRANT_API_KEY
    }.items() if not val]
    raise ValueError(
        f"Missing env variables: {', '.join(missing)}\n"
        "Please create .env file in project root with:\n"
        "OPENAI_API_KEY=sk-...\n"
        "QDRANT_URL=https://your-cluster.qdrant.io:6333\n"
        "QDRANT_API_KEY=your_key_here"
    )

def ingest_docs():
    print("Starting RAG ingestion...")

    # Correct path: backend/ → project root → my-website/docs/
    docs_path = ROOT_DIR / "my-website" / "docs"

    if not docs_path.exists():
        raise FileNotFoundError(f"docs/ folder not found! Expected: {docs_path}")

    print(f"Loading documents from: {docs_path}")

    # Manually collect files and load them using TextLoader
    filepaths = list(docs_path.glob("**/*.md*")) # Collect all .md and .mdx files

    if not filepaths:
        print(f"No files matching pattern '**/*.md*' found in {docs_path}")
        return

    print(f"Found {len(filepaths)} files: {[p.name for p in filepaths]}")

    documents = []
    for filepath in filepaths:
        try:
            loader = TextLoader(str(filepath), encoding="utf-8")
            documents.extend(loader.load())
        except Exception as e:
            print(f"Error loading {filepath}: {e}")

    if not documents:
        print("No documents loaded after processing files. Check for loading errors.")
        return

    print(f"Loaded {len(documents)} files. Creating chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        add_start_index=True
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")

    print("Generating embeddings...")
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=OPENAI_API_KEY
    )

    print(f"Uploading to Qdrant -> {QDRANT_URL}")
    QdrantVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name="docusaurus_rag",
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        force_recreate=True  # Har baar fresh collection ban jaye
    )

    print("INGESTION SUCCESSFUL!")
    print("Your book is now 100% ready for RAG chatbot!")

if __name__ == "__main__":
    ingest_docs()