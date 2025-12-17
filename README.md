# Physical AI & Humanoid Robotics RAG Chatbot

This is a Retrieval-Augmented Generation (RAG) chatbot specifically designed for the Physical AI & Humanoid Robotics curriculum. The system combines a Docusaurus-based documentation website with an AI-powered chat interface that can answer questions based on the course materials.

## Features

- Interactive chatbot with streaming responses
- Docusaurus-based documentation website with curriculum content
- Cohere-powered language model with document grounding
- Qdrant vector database for efficient similarity search
- Floating chat widget accessible from any page
- Dedicated chat interface page

## Architecture

The system consists of three main components:

1. **Frontend**: Docusaurus website with React chat components
2. **Backend**: FastAPI server handling RAG operations
3. **Vector Store**: Qdrant cloud instance storing document embeddings

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- API keys for Cohere and Qdrant

### Environment Variables

Create a `.env.local` file in the RAG-CHATBOT directory with the following:

```env
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=your_qdrant_cloud_url_here
QDRANT_API_KEY=your_qdrant_api_key_here
SITEMAP_URL=https://your-documentation-site/sitemap.xml
```

### Backend Setup

1. Navigate to the RAG-CHATBOT directory:
   ```bash
   cd RAG-CHATBOT
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Populate the knowledge base:
   ```bash
   python ingest_data.py
   ```

4. Start the backend server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:8001`

### Frontend Setup

1. Navigate to the my-website directory:
   ```bash
   cd my-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The website will run on `http://localhost:3000`

## Project Structure

- `app.py`: Main FastAPI application with chat endpoint
- `chatkit_server.py`: Core RAG logic implementation
- `ingest_data.py`: Script to populate knowledge base from sitemap or local files
- `my-website/`: Docusaurus-based documentation site
  - `src/components/ChatKitWidget.tsx`: Chat interface component
  - `src/components/FloatingChatWidget.tsx`: Floating chat widget component
  - `src/pages/chatbot.js`: Dedicated chatbot page
  - `src/theme/Root.js`: Theme override to add floating chat to all pages

## API Endpoints

- `POST /api/chat`: Main chat endpoint accepting thread_id and input
- Response: Streaming Server-Sent Events (SSE) with JSON payloads

## How It Works

1. Documents from the curriculum are ingested and converted to embeddings using Cohere
2. Embeddings are stored in a Qdrant vector database
3. When a user submits a question:
   - Their query is embedded using the same model
   - Similar documents are retrieved from the vector store
   - The LLM generates a response based on the query and retrieved documents
   - Response is streamed back to the user

## Customization

To update the knowledge base:
1. Update your documentation or sitemap
2. Run `python ingest_data.py` to refresh the vector database

To customize the chat interface:
1. Modify components in `my-website/src/components`
2. Adjust styling in `my-website/src/css/custom.css`

## Troubleshooting

- If documents aren't being retrieved, verify the ingestion process completed successfully
- Check that all environment variables are correctly set
- Verify that the Qdrant collection contains the expected data
- Confirm that the backend server is running when using the chat interface

## Deployment

For production deployment, configure your domain URLs in the environment variables and update CORS settings in `app.py` to match your frontend URL.
