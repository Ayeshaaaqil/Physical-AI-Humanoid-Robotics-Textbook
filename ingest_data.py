"""
Robust script to ingest data from sitemap or local files into Qdrant using Cohere embeddings.
Automatically cleans URLs and skips any unreachable pages.
"""
import requests
import xml.etree.ElementTree as ET
import trafilatura
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import cohere
import os
from dotenv import load_dotenv
import glob
import markdown
from pathlib import Path
import re

# Load environment variables
load_dotenv()

# -------------------------------------
# CONFIG
# -------------------------------------
SITEMAP_URL = os.getenv(
    "SITEMAP_URL", 
    "https://physical-ai-humanoid-robotics-book-one-beta.vercel.app/sitemap.xml"
)
LOCAL_DOCS_DIR = os.getenv("LOCAL_DOCS_DIR", "./specs")
COLLECTION_NAME = os.getenv("DOCUMENT_COLLECTION_NAME", "humanoid_ai_book")

cohere_client = cohere.Client(os.getenv("COHERE_API_KEY"))
EMBED_MODEL = os.getenv("EMBEDDING_MODEL", "embed-english-v3.0")

# Connect to Qdrant Cloud
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

# -------------------------------------
# STEP 1 — Extract URLs from sitemap
# -------------------------------------
def get_all_urls(sitemap_url):
    try:
        xml = requests.get(sitemap_url).text
        root = ET.fromstring(xml)

        urls = []
        for child in root:
            loc_tag = child.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
            if loc_tag is not None and loc_tag.text:
                clean_url = loc_tag.text.strip()
                # Remove quotes or any stray characters
                clean_url = re.sub(r"[\"']", "", clean_url)
                if clean_url.startswith("http"):
                    urls.append(clean_url)

        print("\nFOUND URLS FROM SITEMAP:")
        for u in urls:
            print(" -", u)

        return urls
    except Exception as e:
        print(f"\n[WARNING] Could not fetch sitemap: {e}")
        return []

# -------------------------------------
# STEP 2 — Extract local markdown files
# -------------------------------------
def get_local_docs(docs_dir):
    if not os.path.exists(docs_dir):
        print(f"\n[WARNING] Local docs directory {docs_dir} does not exist")
        return []

    md_files = glob.glob(os.path.join(docs_dir, "**/*.md"), recursive=True)
    md_files.extend(glob.glob(os.path.join(docs_dir, "**/*.mdx"), recursive=True))

    print(f"\nFOUND LOCAL MARKDOWN FILES:")
    for file in md_files:
        print(" -", file)

    return md_files

# -------------------------------------
# STEP 3 — Read local markdown file
# -------------------------------------
def read_local_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        html = markdown.markdown(content)
        text = trafilatura.extract(html) if html else content
        return text
    except Exception as e:
        print(f"[ERROR] Could not read file {file_path}: {e}")
        return None

# -------------------------------------
# STEP 4 — Extract text from URL
# -------------------------------------
def extract_text_from_url(url):
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        text = trafilatura.extract(r.text)
        if not text:
            print("[WARNING] No text extracted from:", url)
        return text
    except Exception as e:
        print(f"[ERROR] Could not fetch URL {url}: {e}")
        return None

# -------------------------------------
# STEP 5 — Chunk text
# -------------------------------------
def chunk_text(text, max_chars=1200):
    chunks = []
    start = 0
    while start < len(text):
        end = start + max_chars
        if end >= len(text):
            chunks.append(text[start:])
            break
        split_pos = text[start:end].rfind(". ")
        if split_pos == -1:
            split_pos = max_chars
        chunks.append(text[start:start+split_pos].strip())
        start += split_pos + 1  # move past the split
    return chunks

# -------------------------------------
# STEP 6 — Create embeddings
# -------------------------------------
def embed(text):
    try:
        response = cohere_client.embed(
            model=EMBED_MODEL,
            input_type="search_document",
            texts=[text],
        )
        return response.embeddings[0]
    except Exception as e:
        print(f"[ERROR] Could not create embedding: {e}")
        return None

# -------------------------------------
# STEP 7 — Store in Qdrant
# -------------------------------------
def create_collection():
    print("\nCreating Qdrant collection...")
    if not qdrant.collection_exists(COLLECTION_NAME):
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=1024,
                distance=Distance.COSINE
            )
        )
    else:
        print("Collection already exists. Skipping creation.")

def save_chunk_to_qdrant(chunk, chunk_id, source):
    vector = embed(chunk)
    if vector is None:
        print(f"[ERROR] Could not embed chunk {chunk_id}, skipping")
        return False

    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=chunk_id,
                vector=vector,
                payload={
                    "source": source,
                    "text": chunk,
                    "chunk_id": chunk_id
                }
            )
        ]
    )
    return True

# -------------------------------------
# MAIN INGESTION PIPELINE
# -------------------------------------
def ingest_documents():
    urls = get_all_urls(SITEMAP_URL)
    local_files = get_local_docs(LOCAL_DOCS_DIR)

    create_collection()
    global_id = 1

    # Process URLs
    for url in urls:
        print("\nProcessing URL:", url)
        text = extract_text_from_url(url)
        if not text:
            print("[SKIP] URL could not be processed:", url)
            continue

        for chunk in chunk_text(text):
            if save_chunk_to_qdrant(chunk, global_id, url):
                print(f"Saved chunk {global_id} from URL: {url}")
                global_id += 1

    # Process local files
    for file_path in local_files:
        print("\nProcessing local file:", file_path)
        text = read_local_file(file_path)
        if not text:
            continue

        for chunk in chunk_text(text):
            if save_chunk_to_qdrant(chunk, global_id, file_path):
                print(f"Saved chunk {global_id} from file: {file_path}")
                global_id += 1

    print("\n✔️ Ingestion completed!")
    print("Total chunks stored:", global_id - 1)

# -------------------------------------
# RUN
# -------------------------------------
if __name__ == "__main__":
    ingest_documents()
