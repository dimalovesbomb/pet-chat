import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../shared/colors';
import { Message as IMessage } from '../../shared/types';
import { Modal } from '../Modal/Modal';
import { getUser } from '../../shared/sessionStorageHelpers';
import { MAX_LENGTH_OF_MESSAGE } from '../../shared/constants';

type MessageProps = IMessage & {
  isMe: boolean;
  prevMessageFromSameSender: boolean;
};

const MessageContainer = styled('div')<{ isMe: boolean; prevMessageFromSameSender: boolean }>(
  ({ isMe, prevMessageFromSameSender }) => ({
    alignSelf: isMe ? 'flex-end' : 'flex-start',
    backgroundColor: isMe ? colors.green.dark : colors.componentsBackground.hover,
    borderRadius: '5px',
    minWidth: '100px',
    maxWidth: '450px',
    padding: '10px',

    display: 'flex',
    flexDirection: 'column',

    marginTop: prevMessageFromSameSender ? '10px' : '0',
  }),
);

const Text = styled.p`
  margin: 0;
  word-wrap: break-word;
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

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
`;

const ShowMoreButton = styled.button`
  border: none;
  background-color: transparent;
  text-decoration: underline;
  font-size: 10px;
  cursor: pointer;
`;

const Info = styled.p`
  font-size: 10px;
  margin: 0 0 0 10px;
`;

const FullMessageModal = styled.div`
  overflow-y: scroll;
`;

export const Message: React.FC<MessageProps> = ({
  senderId,
  message,
  attachments,
  timestamp,
  isMe,
  prevMessageFromSameSender,
}) => {
  const [shouldShowFullMessageModal, setShouldShowFullMessageModal] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const truncatedMessage = useMemo(
    () => (message.length > MAX_LENGTH_OF_MESSAGE ? `${message.substring(0, MAX_LENGTH_OF_MESSAGE)}...` : message),
    [message],
  );

  const { hours, minutes } = {
    hours: new Date(timestamp).getHours(),
    minutes: new Date(timestamp).getMinutes(),
  };
  const sentTime = `${hours}:${minutes}`;
  const senderName = getUser(senderId)?.name;

  useEffect(() => {
    if (message.length > 500) {
      setShouldShowFullMessageModal(true);
    }
  }, [message]);

  return (
    <>
      <MessageContainer isMe={isMe} prevMessageFromSameSender={prevMessageFromSameSender}>
        <Text>{truncatedMessage}</Text>
        {attachments && (
          <AttachmentsContainer>
            {attachments.map((att) => {
              return (
                <ImageContainer>
                  <Image src={att.src} alt={att.src} />
                </ImageContainer>
              );
            })}
          </AttachmentsContainer>
        )}
        <InfoContainer>
          {shouldShowFullMessageModal && (
            <ShowMoreButton onClick={() => setIsModalOpened(true)}>Open full message</ShowMoreButton>
          )}
          <Info>{sentTime}</Info>
        </InfoContainer>
      </MessageContainer>
      <Modal
        closable
        onClose={() => setIsModalOpened(false)}
        isOpened={isModalOpened}
        headerTitle={senderName ? `Message from ${senderName}` : ''}
      >
        <FullMessageModal>
          <p>{message}</p>
        </FullMessageModal>
      </Modal>
    </>
  );
};
