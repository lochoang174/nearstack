import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (text: string, isUser: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello, I'm the Nearstack Assistant. How can I help you today?", isUser: false },
  ]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
