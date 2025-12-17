# Physical AI & Humanoid Robotics Website with Integrated Chatbot

This is a Docusaurus-based documentation website with an integrated RAG (Retrieval-Augmented Generation) chatbot for answering questions about humanoid robotics and physical AI.

## Features

- Comprehensive curriculum on Physical AI & Humanoid Robotics
- Interactive chatbot powered by Cohere and Qdrant
- Floating chat widget available on all pages
- Dedicated chatbot page at `/chatbot`
- Knowledge base built from the documentation content

## Architecture

- Frontend: Docusaurus website with React components
- Backend: FastAPI server with RAG capabilities
- Vector Database: Qdrant cloud instance
- Language Model: Cohere's chat model with document grounding

## Setup Instructions

### Prerequisites

1. Python 3.8+
2. Node.js 16+

### Backend Setup

1. Navigate to the RAG-CHATBOT directory:
   ```bash
   cd RAG-CHATBOT
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables in `.env.local`:
   ```
   COHERE_API_KEY=your_cohere_api_key
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   SITEMAP_URL=https://your-site-url/sitemap.xml
   ```

4. Run the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the my-website directory:
   ```bash
   cd my-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

## Chatbot Integration

The chatbot is integrated in two ways:

1. Floating Chat Widget: Available on all pages as a fixed button in the bottom-right corner
2. Dedicated Chat Page: Accessible at `/chatbot` with the Anthropic ChatKit interface

Both interfaces connect to the same backend API at `http://localhost:8001/api/chat`.

## Knowledge Base

The chatbot's knowledge comes from:

1. Documentation content from the Docusaurus site
2. Content ingested via the `ingest_data.py` script
3. Additional resources specified in the sitemap

To update the knowledge base, run the ingestion script:
```bash
python ingest_data.py
```

## Troubleshooting

- If the chatbot isn't responding, verify the backend server is running
- Check that all API keys are correctly configured
- Ensure the Qdrant collection exists and has been populated with documents
- Verify CORS settings if deploying to different domains

## Deployment

For deployment, ensure that the backend API URL is updated in the frontend components to match your deployed backend URL.