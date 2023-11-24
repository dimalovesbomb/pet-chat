import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from '../../components/Input/Input';
import { colors } from '../../shared/colors';
import { Message } from '../../shared/types';
import { MessagesContainer } from '../../components/MessagesContainer/MessagesContainer';
import { sendMessage } from '../../socket';
import { getMeUser } from '../../shared/sessionStorageHelpers';

const ChatContainer = styled.div`
  display: grid;
  grid-template-rows: 0.93fr 0.07fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    'messages messages'
    'input input';
  height: 100%;
  background-color: ${colors.componentsBackground.primary};
`;

const InputContainer = styled.form`
  display: flex;
  grid-area: input;
  margin-top: 10px;
`;

interface ChatProps {
  messages: Message[];
}

export const Chat: React.FC<ChatProps> = ({ messages }) => {
  const location = useLocation();
  const activeUserId = location.pathname.substring(1);
  const [inputValue, setInputValue] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const meUser = getMeUser();

  useEffect(() => {
    messagesContainerRef.current?.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputValue('');
    sendMessage({
      to: activeUserId,
      senderId: meUser?.id || '',
      message: inputValue,
      timestamp: Date.now(),
      attachments: [],
    });
  };

  return (
    <ChatContainer>
      <MessagesContainer
        messages={messages}
        activeUserId={activeUserId}
        meId={meUser?.id || ''}
        ref={messagesContainerRef}
      />
      {activeUserId && (
        <InputContainer onSubmit={handleOnSubmit}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Here goes your message"
          />
        </InputContainer>
      )}
    </ChatContainer>
  );
};
