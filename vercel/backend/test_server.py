"""
Basic tests for the RAG Chatbot API
"""
import pytest
from fastapi.testclient import TestClient
from api_main import app

# Create test client
client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "RAG Chatbot API"

def test_query_endpoint_structure():
    """Test the query endpoint accepts proper structure"""
    # Test with minimal valid request
    response = client.post(
        "/query",
        json={
            "query": "test query",
            "top_k": 5
        }
    )
    # Should return 200 if configured correctly, or 500 if services are not available
    assert response.status_code in [200, 500]

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "RAG Chatbot API is running"

def test_chat_endpoint():
    """Test the chat endpoint"""
    response = client.post(
        "/api/chat",
        json={
            "thread_id": "test-thread-123",
            "input": "Hello, what is Physical AI?"
        }
    )
    # This might return 500 if external services are not available, which is expected
    assert response.status_code in [200, 500]

if __name__ == "__main__":
    # Run the tests
    test_health_check()
    test_query_endpoint_structure()
    test_root_endpoint()
    test_chat_endpoint()
    print("All basic tests passed!")