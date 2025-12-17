import React from 'react';
import FloatingChatWidget from '../components/FloatingChatWidget';

function Root({ children }) {
  return (
    <>
      {children}
      <FloatingChatWidget />
    </>
  );
}

export default Root;