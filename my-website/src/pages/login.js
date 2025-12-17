import React, { useState } from 'react';
import Layout from '@theme/Layout';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('This is a static login page. Authentication logic needs to be implemented with a backend service (e.g., your FastAPI server, Auth0, Firebase).');
    // In a real application, you would send username and password to a backend API here
    console.log('Attempting to log in with:', { username, password });
  };

  return (
    <Layout title="Login" description="Login to the Physical AI Robotics Portal">
      <main className="container margin-vert--lg">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--ifm-color-primary-lightest)' }}>
          🔐 Login to Your Portal
        </h1>
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', border: '1px solid var(--ifm-color-emphasis-400)', borderRadius: '8px', backgroundColor: 'var(--ifm-background-surface-color)' }}>
          <form onSubmit={handleLogin}>
            <div className="margin-bottom--md">
              <label htmlFor="username-input" className="form-label">
                Username:
              </label>
              <input
                id="username-input"
                type="text"
                className="input-text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
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
            <div className="margin-bottom--md">
              <label htmlFor="password-input" className="form-label">
                Password:
              </label>
              <input
                id="password-input"
                type="password"
                className="input-text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
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
              style={{ width: '100%' }}
            >
              Login
            </button>
          </form>

          {message && (
            <div className="alert alert--info margin-top--md" role="alert">
              {message}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default LoginPage;