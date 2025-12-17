import requests
import json

# Test the backend API directly
def test_backend():
    url = "http://localhost:8002/api/chat"
    
    # Sample request data
    data = {
        "thread_id": "test-thread",
        "input": {"message": "Hello"}
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("Testing connection to:", url)
        response = requests.post(url, json=data, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # First 200 chars
    except requests.exceptions.ConnectionError:
        print("Connection Error: Could not connect to the server")
        print("Make sure the backend server is running on port 8002")
    except requests.exceptions.Timeout:
        print("Timeout: The request took too long to complete")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_backend()