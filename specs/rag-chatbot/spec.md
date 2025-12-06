# RAG Chatbot Feature Specification

## Overview
This document outlines the requirements for integrating a RAG (Retrieval Augmented Generation) chatbot into the Docusaurus-based robotics curriculum website. The chatbot will allow users to ask questions about the book content and receive accurate answers based on the retrieved information.

## Goals
- Provide an interactive way for users to get answers directly from the book content.
- Enhance user experience by offering quick access to information.
- Support both general queries and queries based on selected text from the book.

## In-Scope
- FastAPI backend for RAG logic and API endpoints.
- Qdrant integration for vector database and retrieval.
- OpenAI LLM integration for response generation.
- Docusaurus frontend integration for a floating chatbot widget.
- Text selection functionality to feed context to the chatbot.
- Ingestion script for processing Docusaurus markdown files into Qdrant.
- Basic chat history management.

## Out-of-Scope
- Advanced user authentication for the chatbot.
- Complex UI/UX features beyond a basic floating widget.
- Integration with other knowledge bases or external APIs (beyond Qdrant/OpenAI).
- Real-time chat features (e.g., streaming responses are not a primary focus).

## Functional Requirements

### FR-1: Chatbot Widget
- The chatbot should appear as a floating widget on the Docusaurus site.
- Users should be able to toggle the visibility of the widget.
- The widget should have an input field for typing questions.
- The widget should display the chatbot's responses.

### FR-2: General Query
- Users can ask general questions about the book content.
- The chatbot will retrieve relevant information from Qdrant based on the query.
- The chatbot will generate an answer using the LLM and retrieved context.

### FR-3: Selected Text Query
- Users can select a piece of text on the Docusaurus page.
- An "Ask AI" button should appear near the selected text.
- Clicking the "Ask AI" button should open the chatbot widget with the selected text pre-filled or used as additional context for the query.
- The chatbot will prioritize the selected text when retrieving information and generating responses.

### FR-4: Ingestion Process
- A script should exist to ingest markdown files from the Docusaurus site.
- The script should chunk the text, generate embeddings using OpenAI, and store them in Qdrant.
- The script should store metadata (source URL, title, section) along with the text chunks.

## Technical Requirements

### TR-1: Backend (FastAPI)
- Expose API endpoints for general queries and selected text queries.
- Integrate with Qdrant for vector search.
- Integrate with OpenAI for embeddings and LLM inference.
- Implement CORS to allow requests from the Docusaurus frontend.
- Use environment variables for API keys and configurations.

### TR-2: Frontend (Docusaurus/React)
- Develop a React component for the chatbot widget.
- Implement JavaScript to detect text selection events.
- Implement a mechanism to display the "Ask AI" button near selected text.
- Integrate the chatbot widget with the backend API.
- Ensure responsive design for the widget.

### TR-3: Database (Qdrant)
- Store text chunks and their corresponding embeddings.
- Store metadata like source file, title, and potentially section.

### TR-4: LLM and Embeddings (OpenAI)
- Use `text-embedding-3-small` for generating embeddings.
- Use an appropriate large language model (e.g., `gemini-pro`) for generating responses.

## Future Considerations
- User feedback mechanism for chatbot responses.
- Multi-language support.
- Integration with other external knowledge sources.