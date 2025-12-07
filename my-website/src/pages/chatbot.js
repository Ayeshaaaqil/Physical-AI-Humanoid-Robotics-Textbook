import React from 'react';
import Layout from '@theme/Layout';
import ChatKitWidget from '../components/ChatKitWidget';

function ChatbotPage() {
  return (
    <Layout title="Chatbot" description="Chat with the Humanoid Robotics AI Assistant">
      <main>
        <ChatKitWidget />
      </main>
    </Layout>
  );
}

export default ChatbotPage;
