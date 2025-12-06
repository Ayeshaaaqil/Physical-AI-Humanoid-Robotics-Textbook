import React from 'react';
import ChatKitWidget from '@site/src/components/ChatKitWidget';

function Root({ children }) {
  return (
    <>
      {children}
      <ChatKitWidget />
    </>
  );
}

export default Root;
