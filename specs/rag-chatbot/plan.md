## Plan for RAG Chatbot Implementation

### A. Complete folder structure changes

```
humanoid-robotics/
├── my-website/ (existing Docusaurus project)
│   ├── src/
│   │   ├── css/ (existing)
│   │   ├── pages/ (existing)
│   │   │   └── chatbot.js (existing - will be modified or replaced)
│   │   └── theme/ (new directory for Docusaurus theme extensions)
│   │       └── ChatbotWidget/ (new React component for floating widget)
│   │           ├── index.tsx
│   │           └── index.module.css
│   ├── static/ (existing)
│   ├── docusaurus.config.js (existing - will be modified)
│   ├── sidebars.js (existing)
│   ├── package.json (existing - will be modified)
│   └── authors.yml (existing)
├── backend/ (new directory for FastAPI backend)
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── ingestion/ (new directory for ingestion script)
│   ├── ingest.py
│   ├── requirements.txt
│   └── .env.example
└── .env.example (root level .env.example to encompass all services)
```

### B. New files with full code (placeholders for now, will be filled in during execution)

#### `backend/main.py`
```python
# Placeholder for FastAPI backend code
# - FastAPI app initialization
# - API endpoints for /query (normal chat) and /query_selection (selected text chat)
# - Qdrant integration for retrieval
# - Neon Postgres integration for chat history and document metadata
# - OpenAI LLM integration
# - CORS configuration
# - Environment variable handling
```

#### `ingestion/ingest.py`
```python
# Placeholder for ingestion script
# - Docusaurus site scraping (local markdown files)
# - Text chunking
# - OpenAI embeddings generation
# - Qdrant storage with metadata (source URL, title, section)
# - Neon Postgres storage for document metadata
# - Environment variable handling
```

#### `my-website/src/theme/ChatbotWidget/index.tsx`
```typescript
// Placeholder for React ChatbotWidget component
// - Floating chatbot UI
// - Toggle visibility
// - Input field for questions
// - Display area for answers
// - Integration with backend API
```

#### `my-website/src/theme/ChatbotWidget/index.module.css`
```css
/* Placeholder for ChatbotWidget styling */
```

#### `my-website/src/theme/DocItem/Content/index.js` (for selection handler)
```javascript
// Placeholder for Docusaurus DocItem content wrapper modification
// - JavaScript to detect text selection
// - Render "Ask AI" button near selection
// - Open ChatbotWidget with pre-filled selected text
```

#### `my-website/docusaurus.config.js` (modifications)
```javascript
// Placeholder for docusaurus.config.js modifications
// - Theme customization to include ChatbotWidget
// - Potentially expose backend API URL as a global variable
```

#### `backend/requirements.txt`
```
# Placeholder for backend Python dependencies
fastapi
uvicorn
qdrant-client
openai
python-dotenv
psycopg2-binary # for Neon Postgres
```

#### `ingestion/requirements.txt`
```
# Placeholder for ingestion Python dependencies
beautifulsoup4 # for scraping
markdown-splitter # for chunking
openai
qdrant-client
python-dotenv
psycopg2-binary # for Neon Postgres
```

### C. Exact .env.example

```
# Root level .env.example for all services
OPENAI_API_KEY="your_openai_api_key_here"

# Backend specific
FASTAPI_PORT=8000
QDRANT_URL="your_qdrant_url_here"
QDRANT_API_KEY="your_qdrant_api_key_here"
NEON_DATABASE_URL="your_neon_postgres_connection_string_here"

# Frontend specific (for Docusaurus to access backend)
# This will be passed as an environment variable during Docusaurus build
PUBLIC_CHATBOT_API_URL="http://localhost:8000" # Or your deployed backend URL

# Ingestion specific
DOCUSAURUS_SITE_URL="http://localhost:3000" # Or your deployed Docusaurus site URL
QDRANT_COLLECTION_NAME="docusaurus_docs"
```

### D. Step-by-step commands

#### 1. Set up Qdrant Cloud & Neon projects

*   **Qdrant Cloud:**
    1.  Go to [Qdrant Cloud](https://cloud.qdrant.io/) and sign up for the free tier.
    2.  Create a new cluster.
    3.  Note down your `QDRANT_URL` and `QDRANT_API_KEY`.

*   **Neon Serverless Postgres:**
    1.  Go to [Neon](https://neon.tech/) and sign up for the free tier.
    2.  Create a new project.
    3.  Note down your connection string, which will be your `NEON_DATABASE_URL`.

#### 2. Run ingestion locally

1.  **Prepare environment variables:**
    *   Create a `.env` file in the `ingestion/` directory based on `ingestion/.env.example`.
    *   Fill in `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `NEON_DATABASE_URL`, `DOCUSAURUS_SITE_URL`, `QDRANT_COLLECTION_NAME`.
    *   `DOCUSAURUS_SITE_URL` should point to your *local* Docusaurus site (`http://localhost:3000`) if you want to ingest local files, or your *deployed* GitHub Pages URL if you want to ingest the live content.

2.  **Install dependencies:**
    ```bash
    cd ingestion
    pip install -r requirements.txt
    ```

3.  **Run ingestion script:**
    ```bash
    python ingest.py
    ```
    *This will scrape your Docusaurus site, chunk the content, create embeddings, and store them in Qdrant and Neon.*

#### 3. Run backend locally

1.  **Prepare environment variables:**
    *   Create a `.env` file in the `backend/` directory based on `backend/.env.example`.
    *   Fill in `OPENAI_API_KEY`, `FASTAPI_PORT`, `QDRANT_URL`, `QDRANT_API_KEY`, `NEON_DATABASE_URL`.

2.  **Install dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  **Run FastAPI server:**
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    *The backend should now be running locally, listening for requests on port 8000.*

#### 4. Deploy backend to Render.com or Railway.app

**General Steps (adjust for specific platform):**

1.  **Create a new web service:** Link your backend GitHub repository.
2.  **Configure build command:** `pip install -r requirements.txt`
3.  **Configure start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT` (The `$PORT` environment variable is automatically provided by platforms like Render/Railway).
4.  **Set environment variables:** Add all variables from your `backend/.env.example` (e.g., `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `NEON_DATABASE_URL`) to the deployment environment settings.
5.  **CORS:** Ensure your Docusaurus site's URL (e.g., `https://your-robotics-curriculum.com`) is allowed in the CORS configuration within `backend/main.py`.
6.  **Deployment:** Deploy the service.
7.  **Note down the deployed URL:** This will be your `PUBLIC_CHATBOT_API_URL` for the frontend.

#### 5. Add chatbot to the live site

1.  **Modify `docusaurus.config.js`:**
    *   Update the `PUBLIC_CHATBOT_API_URL` in your local `.env` file in the `my-website/` directory to point to your *deployed* backend URL.
    *   In `docusaurus.config.js`, configure a client-side global variable or pass it directly to the custom theme component.

2.  **Add `ChatbotWidget` and selection handler to Docusaurus:**
    *   Create `my-website/src/theme/ChatbotWidget/index.tsx` and `my-website/src/theme/ChatbotWidget/index.module.css`.
    *   Modify `my-website/src/theme/Layout/index.js` or `my-website/src/theme/DocItem/Content/index.js` to render the `ChatbotWidget` and implement the text selection logic.

3.  **Install frontend dependencies:**
    ```bash
    cd my-website
    npm install # if new dependencies for React components are needed
    ```

4.  **Build Docusaurus site:**
    ```bash
    cd my-website
    npm run build
    ```

5.  **Deploy to GitHub Pages:** Push your updated Docusaurus code to your GitHub repository. GitHub Pages will automatically redeploy the updated site with the chatbot.

---