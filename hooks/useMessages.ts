import { useEffect, useState } from 'react';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    const response = await fetch('/api');
    const json = await response.json();

    setMessages(json);
  };

  useEffect(() => {
    fetchMessages();
  }, [setMessages]);

  const addMessage = async (message: string) => {
    await fetch('/api', {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    await fetchMessages();
  };

  return { messages, addMessage };
};
