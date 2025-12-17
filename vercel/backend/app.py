# This file has been replaced by api_main.py
# Redirecting to use the main API implementation
from .api_main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_main:app", host="127.0.0.1", port=8000)