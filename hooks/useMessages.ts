import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [uuid, setUuid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fetchMessages = async (id: string) => {
    const response = await fetch('/api/getMessages', {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    });
    const json = await response.json();

    setMessages(json);
  };

  const getAIAnswer = async (question: string) => {
    await fetch('/api/ai-call', {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        id: uuid,
      }),
    });
  };

  useEffect(() => {
    const storedUuid = localStorage.getItem('uuid');
    const generatedUuid = storedUuid || uuidv4();
    setUuid(generatedUuid);
    localStorage.setItem('uuid', generatedUuid);

    fetchMessages(uuid);
  }, [setMessages, setUuid, uuid]);

  const addMessage = async (message: string) => {
    await fetch('/api', {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        id: uuid,
      }),
    });

    await fetchMessages(uuid);
    setIsLoading(true);
    await getAIAnswer(message);
    await fetchMessages(uuid);
    setIsLoading(false);
  };

  return { messages, addMessage, isLoading };
};
