import React from 'react';
import ChatKitWidget from '../components/ChatKitWidget';

function Root({ children }) {
  return (
    <>
      {children}
      <ChatKitWidget />
    </>
  );
}

export default Root;
