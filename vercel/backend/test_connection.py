"""
Script to test the connection to Qdrant and verify that the collection exists
"""
import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient

# Load environment variables
load_dotenv()

# Get environment variables
qdrant_url = os.getenv("QDRANT_URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")
collection_name = os.getenv("COLLECTION_NAME", "humanoid_ai_book")

print("Testing Qdrant connection...")

try:
    # Connect to Qdrant
    client = QdrantClient(
        url=qdrant_url,
        api_key=qdrant_api_key,
    )
    
    print(f"Connected to Qdrant at {qdrant_url}")
    
    # List all collections
    collections = client.get_collections()
    print("Available collections:")
    for collection in collections.collections:
        print(f"  - {collection.name} (points: {collection.point_count})")
    
    # Check if our collection exists
    collection_exists = any(c.name == collection_name for c in collections.collections)
    
    if collection_exists:
        print(f"\n✓ Collection '{collection_name}' exists!")
        
        # Get collection info
        collection_info = client.get_collection(collection_name)
        print(f"Points in collection: {collection_info.point_count}")
        print(f"Vector size: {collection_info.config.params.vectors.size}")
        print(f"Distance: {collection_info.config.params.vectors.distance}")
    else:
        print(f"\n✗ Collection '{collection_name}' does not exist!")
        print("You need to run the ingestion script first to create the collection and add data.")
        
except Exception as e:
    print(f"X Error connecting to Qdrant: {e}")
    print("\nMake sure you have set the correct QDRANT_URL and QDRANT_API_KEY in your .env file")

print("\nTesting complete.")