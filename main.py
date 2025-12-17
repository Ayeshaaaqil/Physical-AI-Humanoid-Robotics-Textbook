from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def health():
    return {"status": "running"}


# import uvicorn
# from app.api_main import app

# if __name__ == "__main__":
#     uvicorn.run(
#         "app.api_main:app",
#         host="0.0.0.0",
#         port=8002,
#         reload=True,
#         log_level="info"
#     )