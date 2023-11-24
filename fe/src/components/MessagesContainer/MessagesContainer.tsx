import React, { forwardRef } from 'react';
import { FloatingBackground } from '../FloatingBackground/FloatingBackground';
import { SelectUserBanner } from '../SelectUserBanner/SelectUserBanner';
import { Message } from '../Message/Message';
import type { Message as MessageType } from '../../shared/types';
import styled from 'styled-components';

const MessagesContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  grid-area: messages;
  position: relative;
  height: 100%;
  padding: 20px 20px 0 20px;
`;

interface MessagesContainerProps {
  messages: MessageType[];
  activeUserId: string;
  meId: string;
}

export const MessagesContainer = forwardRef<HTMLDivElement, MessagesContainerProps>(
  ({ messages, activeUserId, meId }, ref) => {
    return (
      <MessagesContainerDiv ref={ref}>
        <FloatingBackground />
        {!activeUserId && <SelectUserBanner />}
        {activeUserId &&
          messages.map(({ senderId, message, attachments, timestamp, to }, index) => {
            return (
              <Message
                key={`${senderId}_${timestamp}_${Math.random()}`}
                senderId={senderId}
                message={message}
                attachments={attachments}
                timestamp={timestamp}
                isMe={meId === senderId}
                prevMessageFromSameSender={messages[index - 1]?.senderId === senderId}
                to={to}
              />
            );
          })}
      </MessagesContainerDiv>
    );
  },
);
