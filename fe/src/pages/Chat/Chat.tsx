import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from '../../components/Input/Input';
import { colors } from '../../shared/colors';
import { State } from '../../shared/types';
import { MessagesContainer } from '../../components/MessagesContainer/MessagesContainer';
import { sendMessage } from '../../socket';
import { getMeUser } from '../../shared/sessionStorageHelpers';
import { socket } from '../../socket';

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
  state: State[];
}

export const Chat: React.FC<ChatProps> = ({ state }) => {
  const location = useLocation();
  const [currMessages, setCurrMessages] = useState<State[]>([]);
  const activeUserId = location.pathname.substring(1);
  const [inputValue, setInputValue] = useState('');
  const messages = currMessages.find((user) => user.id === activeUserId)?.messages || [];
  const meUser = getMeUser();

  useEffect(() => {
    setCurrMessages(state);
  }, [state]);

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputValue('');
    sendMessage(socket, {
      to: activeUserId,
      senderId: meUser?.id || '',
      message: inputValue,
      timestamp: Date.now(),
      attachments: [],
    });
  };

  return (
    <ChatContainer>
      <MessagesContainer messages={messages} activeUserId={activeUserId} meId={meUser?.id || ''} />
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
