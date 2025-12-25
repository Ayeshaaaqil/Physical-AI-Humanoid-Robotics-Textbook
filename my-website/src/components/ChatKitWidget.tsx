import React, { useEffect, useState, useRef } from 'react';

const ChatKitWidget = () => {
  const [chatkitLoaded, setChatkitLoaded] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Check if ChatKit script is already loaded
    if (window.ChatKit) {
      setChatkitLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/chatkit@latest/dist/chatkit.js';
    script.async = true;
    script.onload = () => {
      setChatkitLoaded(true);
      console.log('ChatKit script loaded successfully');
    };
    script.onerror = (error) => {
      console.error('Failed to load ChatKit script:', error);
    };

    // Append script to document body
    document.body.appendChild(script);

    return () => {
      // Clean up script on component unmount
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (chatkitLoaded && chatContainerRef.current) {
      try {
        // Create a custom API handler for ChatKit
        const customApiHandler = {
          // Override ChatKit's default API calls with fetch
          async sendUserMessage(threadId, message, attachments) {
            try {
              // Get selected text
              const selectedText = window.getSelection().toString().trim();

              // Ask user if they want to use selected text if text is selected
              let useSelectedText = false;
              if (selectedText) {
                useSelectedText = window.confirm(`You have selected text: "${selectedText.substring(0, 50)}...". Do you want to ask about this selected text?`);
              }

              const payload = {
                session_id: threadId || `session_${Date.now()}`, // Changed to match backend: session_id instead of thread_id
                message: useSelectedText ? `${message} - Context: ${selectedText}` : message, // Changed to match backend: message instead of input
                mode: useSelectedText ? "selected-text" : "full-book" // Added required mode field
              };

              const response = await fetch('https://humanoid-robortics-sluk.vercel.app/api/v1/chat', { // Updated to actual deployed endpoint
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
              });

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorText}`);
              }

              const data = await response.json();

              // Format the response to match ChatKit expectations
              return [{
                type: 'text.response',
                content: data.response,
                sources: data.sources || []
              }];
            } catch (error) {
              console.error('Error sending message:', error);
              return [{ type: 'error.response', content: `Error: ${error.message}` }];
            }
          }
        };

        const chat = new window.ChatKit({
          // Use a custom API handler instead of apiUrl
          customApiHandler: customApiHandler,
          element: chatContainerRef.current,
          config: {
            defaultParticipant: {
              name: 'Physical AI Assistant',
              avatarUrl: '/img/logo.svg',
            },
            placeholder: 'Ask me about Physical AI, robotics, ROS 2, digital twins...',
            theme: {
              // Custom theme for better integration with Docusaurus
              primaryColor: '#007cba', // Docusaurus primary color
              secondaryColor: '#f0f8ff',
              backgroundColor: '#ffffff',
              textColor: '#222222',
              inputBackgroundColor: '#ffffff',
              inputTextColor: '#222222',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            },
          },
        });
        chat.render();
        console.log('ChatKit widget rendered');
      } catch (error) {
        console.error('Error rendering ChatKit widget:', error);
      }
    }
  }, [chatkitLoaded]);

  return (
    <div
      ref={chatContainerRef}
      style={{
        height: 'calc(100vh - var(--ifm-navbar-height))',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!chatkitLoaded && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '1rem'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '1rem'
            }}>
              🤖
            </div>
            <p>Loading Physical AI Assistant...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatKitWidget;
