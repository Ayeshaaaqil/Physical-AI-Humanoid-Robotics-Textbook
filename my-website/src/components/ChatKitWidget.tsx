import React, { useState, useRef, useEffect } from 'react';

// Define types for our messages
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatKitWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string>('default-thread');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Determine backend URL: Prioritize global config, then default to the deployed backend
      // Using 'typeof process' check to avoid browser errors
      const BACKEND_URL = typeof window !== 'undefined' && window.CHATBOT_BACKEND_URL
        ? window.CHATBOT_BACKEND_URL
        : (typeof process !== 'undefined' && process.env ? process.env.BACKEND_URL : null) || 'https://ayesha-aaqil-rag-chatbot.hf.space';

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          input: { message: inputValue }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Handle streaming response
      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      // Create assistant message
      const assistantMessageId = `assistant-${Date.now()}`;
      const initialAssistantMessage: Message = {
        id: assistantMessageId,
        content: '',
        role: 'assistant',
        timestamp: new Date(),
      };

      // Add empty assistant message to display
      setMessages(prev => [...prev, initialAssistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE format
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            if (data && data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullResponse += parsed.content;

                  // Update the assistant message with new content
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: fullResponse }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // If it's not valid JSON, append as plain text if it's not a [DONE] signal
                if (data.trim() && data !== '[DONE]') {
                  fullResponse += data;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: fullResponse }
                        : msg
                    )
                  );
                }
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: `Error: ${(error as Error).message || 'Failed to send message'}`,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        height: 'calc(100vh - var(--ifm-navbar-height))',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--ifm-background-color)',
        color: 'var(--ifm-font-color-base)',
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid var(--ifm-toc-border-color)',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          backgroundColor: 'var(--ifm-card-background-color)',
        }}
      >
        AI Assistant
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--ifm-color-secondary-darkest)',
            }}
          >
            <p>Ask me anything about humanoid robotics...</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: '1rem',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor:
                      message.role === 'user'
                        ? 'var(--ifm-color-primary-dark)'
                        : 'var(--ifm-color-gray-100)',
                    color: message.role === 'user' ? 'white' : 'var(--ifm-font-color-base)',
                  }}
                >
                  {message.content}
                </div>
                <small
                  style={{
                    display: 'block',
                    marginTop: '0.25rem',
                    textAlign: 'right',
                    color: 'var(--ifm-color-secondary-darkest)',
                    fontSize: '0.75rem',
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  marginBottom: '1rem',
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--ifm-color-gray-100)',
                    color: 'var(--ifm-font-color-base)',
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--ifm-toc-border-color)',
          backgroundColor: 'var(--ifm-card-background-color)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--ifm-toc-border-color)',
              backgroundColor: 'var(--ifm-background-color)',
              color: 'var(--ifm-font-color-base)',
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
              opacity: !inputValue.trim() || isLoading ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatKitWidget;
