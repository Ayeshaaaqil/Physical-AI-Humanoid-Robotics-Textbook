import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';

const BACKEND_URL = typeof window !== 'undefined'
  ? 'http://localhost:8000'
  : process.env.BACKEND_URL || 'https://ayesha-aaqil-rag-chatbot.hf.space';

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Generate a session ID if not exists
      const currentSessionId = sessionId || Math.random().toString(36).substring(2, 9);
      if (!sessionId) setSessionId(currentSessionId);

      const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: currentSessionId,
          message: input,
          mode: "full-book"
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      // Add assistant response to chat
      const assistantMessage = { 
        role: 'assistant', 
        content: data.response, 
        sources: data.sources || [],
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Fetch error:', err);
      
      // Add error message to chat
      const errorMessage = { 
        role: 'error', 
        content: `Error: ${err.message}`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    setError('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout title="AI Chat Assistant" description="Chat with our Physical AI assistant">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12">
            <div className="chat-container">
              <div className="chat-header">
                <h1>🤖 Physical AI & Humanoid Robotics Assistant</h1>
                <div className="chat-actions">
                  <button 
                    onClick={clearChat}
                    className="button button--secondary button--sm"
                    disabled={messages.length === 0}
                  >
                    Clear Chat
                  </button>
                </div>
              </div>

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="welcome-message">
                    <h3>Welcome to the Physical AI Assistant! 🚀</h3>
                    <p>Ask me anything about:</p>
                    <ul>
                      <li>Physical AI concepts and architecture</li>
                      <li>Humanoid robotics and control systems</li>
                      <li>ROS 2 fundamentals</li>
                      <li>Digital twin simulation</li>
                      <li>Vision-Language-Action systems</li>
                      <li>Capstone AI robot pipelines</li>
                    </ul>
                    <p>I'm trained on the entire Physical AI & Humanoid Robotics curriculum.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`message message--${msg.role} ${msg.role === 'error' ? 'message--error' : ''}`}
                    >
                      <div className="message-header">
                        <span className="message-author">
                          {msg.role === 'user' ? '👤 You' : msg.role === 'error' ? '❌ Error' : '🤖 Assistant'}
                        </span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="message-content">
                        {msg.content}
                      </div>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="message-sources">
                          <details>
                            <summary>Sources ({msg.sources.length})</summary>
                            <ul>
                              {msg.sources.map((source, idx) => (
                                <li key={idx}>
                                  <strong>Source {idx + 1}:</strong> {source.content_snippet}
                                </li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="message message--assistant">
                    <div className="message-header">
                      <span className="message-author">🤖 Assistant</span>
                      <span className="message-time">{formatTime(new Date())}</span>
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {error && (
                <div className="alert alert--danger margin-top--md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="chat-input-form">
                <div className="input-container">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Physical AI, robotics, ROS 2, digital twins, VLA systems..."
                    rows={3}
                    disabled={isLoading}
                    className="chat-input"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="chat-submit-button"
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
                <div className="input-hint">
                  Press Shift+Enter for new line • Enter to send
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          max-width: 900px;
          margin: 0 auto;
          height: 80vh;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .chat-header {
          padding: 1rem;
          background-color: var(--ifm-color-primary);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--ifm-color-emphasis-300);
        }

        .chat-header h1 {
          margin: 0;
          font-size: 1.25rem;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background-color: #fafafa;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .welcome-message {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .welcome-message h3 {
          color: var(--ifm-color-primary);
        }

        .welcome-message ul {
          text-align: left;
          max-width: 500px;
          margin: 1rem auto;
          padding-left: 1.5rem;
        }

        .message {
          max-width: 85%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          position: relative;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message--user {
          align-self: flex-end;
          background-color: var(--ifm-color-primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message--assistant {
          align-self: flex-start;
          background-color: white;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-bottom-left-radius: 4px;
        }

        .message--error {
          align-self: flex-start;
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: bold;
        }

        .message-author {
          color: #666;
        }

        .message--user .message-author {
          color: rgba(255, 255, 255, 0.8);
        }

        .message-time {
          color: #999;
        }

        .message-content {
          line-height: 1.5;
        }

        .message-sources {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px dashed #ddd;
          font-size: 0.85rem;
        }

        .message-sources summary {
          cursor: pointer;
          color: #007cba;
          font-weight: 500;
        }

        .message-sources ul {
          margin-top: 0.5rem;
          padding-left: 1.25rem;
        }

        .message-sources li {
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #999;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }

        .chat-input-form {
          padding: 1rem;
          border-top: 1px solid var(--ifm-color-emphasis-300);
          background-color: white;
        }

        .input-container {
          display: flex;
          gap: 0.5rem;
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 6px;
          resize: none;
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: var(--ifm-color-primary);
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .chat-submit-button {
          padding: 0.75rem 1.25rem;
          background-color: var(--ifm-color-primary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .chat-submit-button:hover:not(:disabled) {
          background-color: var(--ifm-color-primary-dark);
        }

        .chat-submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .input-hint {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #999;
          text-align: right;
        }

        @media (max-width: 768px) {
          .chat-container {
            height: 70vh;
            margin: 0 1rem 2rem;
          }

          .message {
            max-width: 90%;
          }

          .chat-header {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }

          .input-container {
            flex-direction: column;
          }

          .chat-submit-button {
            align-self: flex-end;
          }
        }
      `}</style>
    </Layout>
  );
};

export default ChatPage;
