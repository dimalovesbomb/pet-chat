import React from 'react';
import styled from 'styled-components';
import { colors } from '../../shared/colors';
import { Message as IMessage } from '../../shared/types';

type MessageProps = IMessage & {
  isMe: boolean;
  prevMessageFromSameSender: boolean;
};

const MessageContainer = styled('div')<{ isMe: boolean; prevMessageFromSameSender: boolean }>(
  ({ isMe, prevMessageFromSameSender }) => ({
    alignSelf: isMe ? 'flex-end' : 'flex-start',
    backgroundColor: isMe ? colors.green.dark : colors.componentsBackground.hover,
    borderRadius: '5px',
    maxHeight: '200px',
    maxWidth: '300px',
    width: '100%',
    padding: '10px',
    zIndex: colors.zIndex.front,

    display: 'flex',
    flexDirection: 'column',

    marginTop: prevMessageFromSameSender ? '10px' : '0',
  }),
);

const Text = styled.p`
  margin: 0;
`;

const AttachmentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  height: inherit;
  box-sizing: border-box;
`;

const ImageContainer = styled.div`
  display: flex;
  margin: auto;
  height: 100%;
  width: 50%;
  background-clip: content-box;
  object-fit: fill;
`;

const Image = styled.img`
  display: block;
  //height: 100%;
  width: 100%;
`;

const Info = styled.p`
  font-size: 10px;
  align-self: flex-end;
  margin: 0;
`;

export const Message: React.FC<MessageProps> = ({
  senderId,
  message,
  attachments,
  timestamp,
  isMe,
  prevMessageFromSameSender,
}) => {
  const sentTime = new Date(timestamp).toLocaleDateString();

  return (
    <MessageContainer isMe={isMe} prevMessageFromSameSender={prevMessageFromSameSender}>
      <Text>{message}</Text>
      {attachments && (
        <AttachmentsContainer>
          {attachments.map((att) => {
            return (
              <ImageContainer>
                <Image src={att.src} />
              </ImageContainer>
            );
          })}
        </AttachmentsContainer>
      )}
      <Info>{sentTime}</Info>
    </MessageContainer>
  );
};
