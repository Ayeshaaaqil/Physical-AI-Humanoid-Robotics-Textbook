import React, { useState, useEffect, useRef } from 'react';

const ChatKitWidget = () => {
  const [selectedText, setSelectedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const chatButtonRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';

    if (text.length > 0) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      // Position the button above and centered relative to the selection
      setButtonPosition({
        top: rect.top + window.scrollY - 40, // 40px above selection
        left: rect.left + window.scrollX + rect.width / 2 - 75, // Center the button (150px width / 2)
      });
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const openChatWithContext = () => {
    if (window.ChatKit) {
      window.ChatKit.open({
        context: { selected_text: selectedText }
      });
      setShowButton(false); // Hide button after opening chat
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  useEffect(() => {
    // Ensure ChatKit is loaded before trying to use it
    if (window.ChatKit && chatContainerRef.current) {
      window.ChatKit.mount(chatContainerRef.current, {
        serverUrl: 'http://localhost:8001/chat',
        defaultPersona: {
          name: "Docusaurus RAG Agent",
          description: "AI assistant for the Docusaurus book on humanoid robotics.",
        },
        // You can customize the widget's appearance here
        // theme: {
        //   primaryColor: '#6B46C1',
        //   accentColor: '#B088F0',
        // },
      });
    }
  }, [chatContainerRef]);

  return (
    <>
      {showButton && (
        <button
          ref={chatButtonRef}
          onClick={openChatWithContext}
          style={{
            position: 'absolute',
            top: buttonPosition.top,
            left: buttonPosition.left,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 15px',
            cursor: 'pointer',
            zIndex: 10000,
            fontSize: '14px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        >
          Ask AI about this
        </button>
      )}
      <div ref={chatContainerRef} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
        {/* ChatKit widget will be mounted here */}
      </div>
    </>
  );
};

export default ChatKitWidget;
