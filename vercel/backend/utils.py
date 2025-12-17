from qdrant_client import QdrantClient
from qdrant_client.http import models
import cohere
import os
from dotenv import load_dotenv
from typing import List, Dict, Any

load_dotenv()

# Initialize Qdrant Client
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

# Initialize Cohere Client
cohere_client = cohere.Client(os.getenv("COHERE_API_KEY"))

# Collection name
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "humanoid_ai_book")

def embed_query(query: str) -> List[float]:
    """
    Create an embedding for the query using Cohere
    """
    response = cohere_client.embed(
        model="embed-english-v3.0",
        input_type="search_query",
        texts=[query],
    )
    return response.embeddings[0]

def retrieve(query: str, top_k: int = 5) -> str:
    """
    Retrieve relevant chunks from the vector database based on the query
    """
    try:
        # Create embedding for the query
        query_embedding = embed_query(query)
        
        # Search in Qdrant
        search_results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )
        
        # Extract and combine the text from the results
        retrieved_texts = []
        for result in search_results:
            if result.payload and "text" in result.payload:
                retrieved_texts.append(result.payload["text"])
        
        return "\n\n".join(retrieved_texts) if retrieved_texts else f"No relevant content found for query: {query}"
    
    except Exception as e:
        print(f"Error retrieving from Qdrant: {e}")
        return f"Error retrieving content: {str(e)}"

def retrieve_with_user_context(user_text: str, query: str, top_k: int = 3) -> str:
    """
    Retrieve content considering both user-provided text and query
    """
    # Create a combined context
    combined_query = f"{query}\nContext from user: {user_text}"
    
    try:
        # Create embedding for the combined query
        query_embedding = embed_query(combined_query)
        
        # Search in Qdrant
        search_results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )
        
        # Extract and combine the text from the results
        retrieved_texts = []
        for result in search_results:
            if result.payload and "text" in result.payload:
                retrieved_texts.append(result.payload["text"])
        
        # Combine user text with retrieved content
        user_context = f"User provided text: {user_text}\n\n" if user_text else ""
        retrieved_content = "\n\n".join(retrieved_texts) if retrieved_texts else f"No relevant content found."
        
        return f"{user_context}{retrieved_content}"
    
    except Exception as e:
        print(f"Error retrieving from Qdrant: {e}")
        return f"Error retrieving content: {str(e)}"

def add_user_provided_text_to_context(user_text: str) -> str:
    """
    Simply return the user-provided text as context
    This function can be used when user wants to ask questions only about their own text
    """
    return user_text if user_text else ""

# Mock retrieve function for when agential calls it (to match the expected signature)
def retrieve(query: str) -> str:
    """
    Retrieve function for agential library - this calls our main retrieve function
    """
    return retrieve(query, top_k=5)