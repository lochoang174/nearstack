import { useFlow } from '@/app/context/FlowProvider';
import { useMessages } from '@/app/context/MessageProvider';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import styled from 'styled-components';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 20px auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const ChatMessages = styled.div`
  height: 468px;
  overflow-y: auto;
  padding: 20px;
`;

const MessageBubbleContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 15px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
  max-width: 70%;
  ${props => props.isUser ? `
    background-color: #007bff;
    color: white;
  ` : `
    background-color: #e9e9e9;
    color: black;
  `}
`;

const ChatInput = styled.div`
  display: flex;
  padding: 10px;
  background-color: #f9f9f9;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
`;

interface component {
  code: string;
  filename: string;
}

interface responseData {
  message: string;
  components: component[];
}

const ExampleContainer = styled.div`
  position: absolute;
  bottom: 120px;
  left: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ExamplePrompt = styled.div`
  padding: 8px 16px;
  background-color: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Chat: React.FC = () => {
  const { setNodeDefault, addNewNode } = useFlow();
  const { messages, addMessage } = useMessages();
  const [prompt, setPrompt] = useState("");

  const examplePrompts = [
    "Create a login component",
    "Create a dashboard layout",
    "Generate a user profile page"
  ];

  const handleExampleClick = (example: string) => {
    addMessage(example, true);
    setNodeDefault(example, "0");
    handleSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() !== '') {
        addMessage(prompt, true);
        setNodeDefault(prompt, "0");
        handleSend();
        setPrompt('');
      }
    }
  };

  const handleSend = async () => {
    if (prompt.trim()) {
      try {
        const response = await fetch(`http://13.239.57.30/answer?input_str=${prompt}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        const dataResponse: responseData = data;
        console.log(dataResponse);
        addMessage(dataResponse.message, false);
        for (let index = 0; index < dataResponse.components.length; index++) {
          const component = dataResponse.components[index];
          addNewNode(component.code, component.filename, `${index+1}`, dataResponse.components.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <ChatContainer>
      <ChatMessages>
        {messages.map((message, index) => (
          <MessageBubbleContainer key={index} isUser={message.isUser}>
            <MessageBubble isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          </MessageBubbleContainer>
        ))}
      </ChatMessages>
      {messages.length === 1 && (
        <ExampleContainer>
          {examplePrompts.map((example, index) => (
            <ExamplePrompt 
              key={index}
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </ExamplePrompt>
          ))}
        </ExampleContainer>
      )}
      <TextArea
        rows={4}
        placeholder="Input your prompt, ex: Create home component"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </ChatContainer>
  );
};

export default Chat;
