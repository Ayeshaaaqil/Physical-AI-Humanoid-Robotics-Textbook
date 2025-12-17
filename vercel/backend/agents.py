import os
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv()

# Initialize OpenAI client with Gemini API
client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url=os.getenv("GEMINI_BASE_URL")
)

# Import retrieval function
try:
    from utils import retrieve, retrieve_with_user_context
except ImportError as e:
    print(f"Error importing utils: {e}")
    print("utils.py with retrieve function not found. Creating mock functions for testing.")

    def retrieve(query: str, top_k: int = 5):
        """Mock retrieve function for testing"""
        return f"Retrieved information for: {query}"

    def retrieve_with_user_context(user_text: str, query: str, top_k: int = 3):
        """Mock retrieve function for testing"""
        return f"Retrieved information considering user text: {user_text} and query: {query}"

def create_rag_completion(user_input: str, context: str = ""):
    """
    Create a completion using retrieved context
    """
    try:
        # Prepare the system message with instructions
        system_message = """
        You are an AI tutor for the Physical AI & Humanoid Robotics textbook.
        The context contains relevant information from the book.
        Use ONLY the information provided in the context to answer the user's question.
        If the answer is not in the provided context, say "I don't know based on the provided content."
        """

        # Prepare the user message with context
        if context:
            user_message = f"Context:\n{context}\n\nQuestion: {user_input}"
        else:
            user_message = f"Question: {user_input}"

        # Make the API call
        response = client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,
            max_tokens=1000
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"Error in RAG completion: {e}")
        return f"Error processing your request: {str(e)}"

def run_rag_chat(user_input: str, user_text: str = ""):
    """
    Run RAG chat with proper context retrieval
    """
    try:
        # Retrieve context based on whether user provided their own text
        if user_text:
            context = retrieve_with_user_context(user_text, user_input, top_k=3)
        else:
            context = retrieve(user_input, top_k=5)

        # Generate response using the context
        response = create_rag_completion(user_input, context)

        return response

    except Exception as e:
        print(f"Error running RAG chat: {e}")
        return f"Error processing your request: {str(e)}"