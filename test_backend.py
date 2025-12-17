import sys
import os
from pathlib import Path

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).parent / '.env.local')

from app import app
import uvicorn

if __name__ == "__main__":
    print("Starting server on http://127.0.0.1:8002")
    print("Check http://127.0.0.1:8002 in your browser to verify it's running")
    uvicorn.run(app, host="127.0.0.1", port=8002)