import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';

const BACKEND_URL = typeof window !== 'undefined'
  ? 'http://localhost:8002'  // ✅ Correct backend port
  : process.env.BACKEND_URL || 'http://localhost:8002';

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const responseEndRef = useRef(null);

  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const threadId = Math.random().toString(36).substring(2, 9);

      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          message: input,  // ✅ Fixed body structure
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      // Backend returns { events: [ { type: 'assistant.response', content: '...' } ] }
      let fullResponse = '';
      data.events.forEach((event: any) => {
        if (event.type === 'assistant.response') {
          fullResponse += event.content;
        } else if (event.type === 'error') {
          throw new Error(event.content);
        }
      });

      setResponse(fullResponse);

    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Chat" description="Chat with our AI assistant">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>AI Chat Assistant</h1>
            <form onSubmit={handleSubmit}>
              <div className="margin-bottom--md">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: isLoading ? '#ccc' : '#007cba',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>

            {error && (
              <div
                className="alert alert--danger margin-top--md"
                role="alert"
              >
                {error}
              </div>
            )}

            {(response || isLoading) && (
              <div className="margin-top--lg">
                <h3>Response:</h3>
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f6f6f6',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    minHeight: '100px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {response}
                  {isLoading && <span style={{ opacity: 0.6 }}>|</span>}
                  <div ref={responseEndRef} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
