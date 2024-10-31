import { useFlow } from '@/app/context/FlowProvider';
import { useMessages } from '@/app/context/MessageProvider';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
// @ts-ignore
import styled from 'styled-components';
import { Spin } from 'antd';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const ChatMessages = styled.div`
  height: 468px;
  overflow-y: auto;
  padding: 4px;
`;

const MessageBubbleContainer = styled.div<{ isUser: boolean }>`
  display: flex;

  justify-content: ${(props: { isUser: boolean }) => props.isUser? 'flex-end' : 'flex-start'};
  margin-bottom: 15px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  display: inline-block;
  padding: 10px;
  border-radius: 12px;
  max-width: 70%;

  ${(props: { isUser: boolean }) => props.isUser ? `
    background-color: #0B1123;
    color: white;
  ` : `
    background-color: #00B862;
    color: white;
  `}
`;

interface component {
  code: string;
  file_name: string;
}

interface responseData {
  message: string;
  components: component[];
}

const ExampleContainer = styled.div`
  position: absolute;
  bottom: 138px;
  left: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ExamplePrompt = styled.div`
  padding: 8px 16px;
  color: #62DBA3;
  border: 1px solid #62DBA3;
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
  const [isLoading, setIsLoading] = useState(false);

  const examplePrompts = [
    "Create a login component",
    "Create a dashboard layout",
    "Create a button"
  ];

  const handleExampleClick = (example: string) => {
    addMessage(example, true);
    setIsLoading(true);
    setNodeDefault(example, "0");
    handleSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() !== '') {
        addMessage(prompt, true);
        setNodeDefault(prompt, "0");
        setIsLoading(true);
        handleSend();
        setPrompt('');
      }
    }
  };

  const handleSend = async () => {
    if (prompt.trim()) {
      setIsLoading(true);
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
          addNewNode(component.code, component.file_name, `${index+1}`, dataResponse.components.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
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
        {isLoading && (
          <MessageBubbleContainer isUser={false}>
            <MessageBubble isUser={false}>
              <Spin /> Processing...
            </MessageBubble>
          </MessageBubbleContainer>
        )}
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
      <textarea
        rows={4}
        placeholder="Input your prompt, ex: Create home component"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)} 
        onKeyDown={handleKeyDown}
        className="w-full p-2 rounded-lg bg-[#0B1123] text-white resize-none border-none focus:outline-none focus:ring-0"
      />
    </ChatContainer>
  );
};

export default Chat;
