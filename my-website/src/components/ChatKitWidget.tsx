import React, { useState, useRef, useEffect } from 'react';

// Define types for messages
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
  const [threadId] = useState<string>('default-thread');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Set deployed backend URL
  const BACKEND_URL = 'https://ayesha-aaqil-rag-chatbot.hf.space';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
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
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, input: { message: inputValue } }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      const assistantMessageId = `assistant-${Date.now()}`;
      const initialAssistantMessage: Message = {
        id: assistantMessageId,
        content: '',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, initialAssistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data && data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullResponse += parsed.content;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg
                    )
                  );
                }
              } catch {
                // Append non-JSON data as plain text
                fullResponse += data;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg
                  )
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <div style={{ padding: '1rem', fontWeight: 'bold', borderBottom: '1px solid gray' }}>
        AI Assistant
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Ask me anything about humanoid robotics...
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '1rem',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: msg.role === 'user' ? '#1f6feb' : '#f0f0f0',
                    color: msg.role === 'user' ? 'white' : 'black',
                  }}
                >
                  {msg.content}
                </div>
                <small style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', textAlign: 'right' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            ))}
            {isLoading && <div style={{ color: 'gray' }}>Thinking...</div>}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid gray' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid gray' }}
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading} style={{ padding: '0.5rem 1rem' }}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatKitWidget;
