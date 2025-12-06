# RAG Chatbot Implementation Tasks

This document outlines the tasks required to implement the RAG Chatbot feature, based on the `spec.md` and `plan.md` documents.

## A. Backend Implementation

### Task 1: Update `backend/main.py`
- **Description:** Integrate RAG logic and ChatKit server components into `backend/main.py` as per the plan.
- **Acceptance Criteria:**
    - FastAPI app initializes correctly.
    - `/query` and `/query_selection` endpoints are functional.
    - Qdrant client is initialized and used for retrieval.
    - OpenAI LLM is used for response generation.
    - CORS is configured to allow frontend requests.
    - Environment variables are correctly loaded and used.
- **Dependencies:** None

### Task 2: Remove `backend/rag_tool.py`
- **Description:** Remove the `rag_tool.py` file, as its functionality will be integrated directly into `main.py` or handled by the ChatKit agent structure.
- **Acceptance Criteria:**
    - `backend/rag_tool.py` no longer exists.
- **Dependencies:** Task 1

### Task 3: Update `backend/requirements.txt`
- **Description:** Add any new Python dependencies required for the updated `backend/main.py` (e.g., `qdrant-client`, `openai`, `python-dotenv`, `psycopg2-binary`).
- **Acceptance Criteria:**
    - `backend/requirements.txt` contains all necessary dependencies.
- **Dependencies:** Task 1

### Task 4: Install Backend Dependencies
- **Description:** Install the updated Python dependencies for the backend.
- **Acceptance Criteria:**
    - All dependencies listed in `backend/requirements.txt` are successfully installed.
- **Dependencies:** Task 3

### Task 5: Restart FastAPI Server
- **Description:** Restart the FastAPI server to apply changes and verify functionality.
- **Acceptance Criteria:**
    - FastAPI server starts without errors.
    - Endpoints are accessible and return expected responses.
- **Dependencies:** Task 4

## B. Ingestion Implementation

### Task 6: Implement `ingestion/ingest.py`
- **Description:** Create or update `ingestion/ingest.py` to scrape Docusaurus site, chunk content, generate embeddings, and store in Qdrant and Neon Postgres.
- **Acceptance Criteria:**
    - Script runs successfully without errors.
    - Markdown files are scraped and chunked correctly.
    - Embeddings are generated and stored in Qdrant.
    - Document metadata is stored in Neon Postgres.
- **Dependencies:** None (can be run independently)

### Task 7: Update `ingestion/requirements.txt`
- **Description:** Add necessary Python dependencies for `ingestion/ingest.py` (e.g., `beautifulsoup4`, `markdown-splitter`, `openai`, `qdrant-client`, `python-dotenv`, `psycopg2-binary`).
- **Acceptance Criteria:**
    - `ingestion/requirements.txt` contains all necessary dependencies.
- **Dependencies:** Task 6

### Task 8: Install Ingestion Dependencies
- **Description:** Install the Python dependencies for the ingestion script.
- **Acceptance Criteria:**
    - All dependencies listed in `ingestion/requirements.txt` are successfully installed.
- **Dependencies:** Task 7

## C. Frontend Implementation

### Task 9: Create Chatbot Widget Component
- **Description:** Develop `my-website/src/theme/ChatbotWidget/index.tsx` and `index.module.css` for the floating chatbot UI.
- **Acceptance Criteria:**
    - Chatbot widget is rendered correctly.
    - Widget can be toggled visible/hidden.
    - Input field and display area are present.
- **Dependencies:** None

### Task 10: Implement Text Selection Handler
- **Description:** Modify `my-website/src/theme/DocItem/Content/index.js` or `Layout` to detect text selection and render an "Ask AI" button.
- **Acceptance Criteria:**
    - Text selection triggers the "Ask AI" button.
    - Clicking the button opens the chatbot with selected text context.
- **Dependencies:** Task 9

### Task 11: Configure Docusaurus
- **Description:** Update `my-website/docusaurus.config.js` to include the ChatbotWidget and pass backend API URL.
- **Acceptance Criteria:**
    - Docusaurus theme correctly incorporates the chatbot widget.
    - Frontend can access the backend API URL.
- **Dependencies:** Task 9, Task 10

### Task 12: Install Frontend Dependencies
- **Description:** Install any new `npm` dependencies for the Docusaurus frontend.
- **Acceptance Criteria:**
    - All necessary frontend dependencies are installed.
- **Dependencies:** Task 9, Task 10, Task 11

### Task 13: Build Docusaurus Site
- **Description:** Build the Docusaurus site to incorporate frontend changes.
- **Acceptance Criteria:**
    - `npm run build` completes successfully without errors.
    - Static site files are generated correctly.
- **Dependencies:** Task 12

### Task 14: Deploy Docusaurus Site
- **Description:** Deploy the updated Docusaurus site to GitHub Pages or a similar hosting service.
- **Acceptance Criteria:**
    - Deployed site includes the functional chatbot widget.
    - Chatbot interacts correctly with the deployed backend.
- **Dependencies:** Task 13

## D. Environment Setup & Deployment

### Task 15: Set up `.env` files
- **Description:** Create and populate `.env` files for `backend/`, `ingestion/`, and `my-website/` based on their respective `.env.example` files and the root `.env.example`.
- **Acceptance Criteria:**
    - All necessary environment variables are set correctly across services.
- **Dependencies:** None

### Task 16: Deploy Backend (Render/Railway)
- **Description:** Deploy the FastAPI backend to a platform like Render.com or Railway.app.
- **Acceptance Criteria:**
    - Backend service is deployed and running.
    - Public API URL is obtained.
- **Dependencies:** Task 1, Task 3, Task 4