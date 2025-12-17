```yaml
id: 1
title: RAG Chatbot Implementation
stage: misc
date_iso: 2025-12-06
surface: agent
model: claude-opus-4-5-20251101
feature: rag-chatbot
branch: 1-robotics-curriculum
user: ""
command: ""
labels: ["rag", "chatbot", "docusaurus", "fastapi", "chatkit", "qdrant", "openai"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - backend/
  - backend/main.py
  - backend/ingest.py
  - backend/requirements.txt
  - backend/.env.example
  - src/components/ChatKitWidget.tsx
  - src/theme/Root.js
  - my-website/docusaurus.config.js
tests_yaml: []
outcome: All components for a local RAG chatbot with Docusaurus integration have been generated, including backend and frontend changes, and deployment steps.
```

### Prompt

```
I am building a RAG chatbot for my Docusaurus book (Spec-Kit Plus template).

Current exact status:
- Docusaurus runs locally using npm start → opens at http://localhost:8000
- I use npm, not yarn
- Not yet deployed to GitHub Pages
- Backend (FastAPI + ChatKit) will also run locally
- I have Qdrant Cloud Free Tier ready + OpenAI API key

Goal: First make 100% working RAG chatbot LOCALLY, then give deploy steps.

MUST HAVE features:
1. Full RAG: Ingest all .md/.mdx files from docs/ folder → chunk → embed with OpenAI text-embedding-3-small → store in Qdrant
2. Selected text magic: User highlights any text on the page → a floating "Ask AI about this" button appears near selection → click → chatbot opens with that exact text as priority context
3. Beautiful floating ChatKit widget (bottom-right corner, exactly like Claude.dev)
4. Use official OpenAI ChatKit (openai-chatkit Python SDK + chatkit-js in browser)
5. Agent with proper RAG retrieval tool from Qdrant + full support for selected_text passed from frontend
6. Zero connection errors locally (proper CORS, health check, correct ports)

Generate everything I need:

A. Backend folder (complete files)
   - main.py → full code with ChatKit server + RAG agent + selected_text handling
   - ingest.py → complete working ingestion script (run once)
   - requirements.txt
   - .env.example

B. Docusaurus changes
   - src/components/ChatKitWidget.tsx → with text selection → floating "Ask AI" button → opens chat with context
   - src/theme/Root.js → to inject the widget on every page
   - How to load chatkit.js (CDN is fine)

C. Exact commands I have to run RIGHT NOW (local only):
   1. cd backend
   2. pip install -r requirements.txt
   3. python ingest.py
   4. uvicorn main:app --reload --port 8001
   5. Open new terminal → cd .. (back to root)
   6. npm start
   7. Go to http://localhost:8000 → select any text → click "Ask AI about this" → chatbot opens → perfect answer from book only

D. After everything works locally → simple deployme
```

### Response

All requested files and configurations for the RAG chatbot have been generated. This includes the backend FastAPI application with ChatKit integration, the ingestion script, Docusaurus frontend components for selected text handling and widget injection, and instructions for loading the ChatKit JS CDN. Additionally, detailed local run commands and simple deployment steps for both the frontend and backend have been provided.
