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
        const chat = new window.ChatKit({
          apiUrl: 'http://localhost:8000/chat', // Your FastAPI backend URL
          element: chatContainerRef.current,
          config: {
            defaultParticipant: {
              name: 'AI Assistant',
              avatarUrl: '/img/logo.svg',
            },
            placeholder: 'Ask me anything about humanoid robotics...',
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
        <p>Loading ChatKit widget...</p>
      )}
    </div>
  );
};

export default ChatKitWidget;
