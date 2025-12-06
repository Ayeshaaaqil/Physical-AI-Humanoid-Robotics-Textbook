import React, { useState } from 'react';
import Layout from '@theme/Layout';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer('');

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error('Error fetching chatbot response:', err);
      setError('Failed to get a response from the chatbot. Please ensure the FastAPI server is running and accessible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="RAG Chatbot" description="Chat with your book using AI">
      <main className="container margin-vert--lg">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--ifm-color-primary-lightest)' }}>
          📚 Chat with Your Book
        </h1>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', border: '1px solid var(--ifm-color-emphasis-400)', borderRadius: '8px', backgroundColor: 'var(--ifm-background-surface-color)' }}>
          <form onSubmit={handleSubmit}>
            <div className="margin-bottom--md">
              <label htmlFor="question-input" className="form-label">
                Ask a question about your ingested documents:
              </label>
              <input
                id="question-input"
                type="text"
                className="input-text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What is the role of AI in humanoid robotics?"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid var(--ifm-color-emphasis-500)',
                  backgroundColor: 'var(--ifm-background-color)',
                  color: 'var(--ifm-font-color-base)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              className="button button--primary button--lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Thinking...' : 'Get Answer'}
            </button>
          </form>

          {error && (
            <div className="alert alert--danger margin-top--md" role="alert">
              {error}
            </div>
          )}

          {answer && (
            <div className="card margin-top--md">
              <div className="card__header">
                <h3>Answer</h3>
              </div>
              <div className="card__body">
                <p>{answer}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default Chatbot;