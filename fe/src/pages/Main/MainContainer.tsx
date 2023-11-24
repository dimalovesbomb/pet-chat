import React, { useEffect, useRef, useState } from 'react';
import { Message, User } from '../../shared/types';
import { socket } from '../../socket';
import { EventsNames } from '../../socket/eventsNames';
import {
  getMeUser,
  initializeSessionStorage,
  rewriteState,
  SESSION_STORAGE_USER_ID,
} from '../../shared/sessionStorageHelpers';
import { createId } from '../../shared/createId';
import { toBase64 } from '../../shared/imageToBase64';

interface Props {
  users: User[];
  messages: Message[];
  formProps: {
    inputValue: string;
    setInputValue: (value: string) => void;
    fileValue: File | null;
    setFileValue: (value: File | null) => void;
    onSubmit: () => void;
    shouldOpenModal: boolean;
  };
}

interface MainContainerProps {
  children: (props: Props) => React.ReactElement;
}

export const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const assignedUserId = useRef(JSON.parse(sessionStorage.getItem(SESSION_STORAGE_USER_ID) || '{}'));
  const [usersList, setUsersList] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [shouldRegister, setShouldRegister] = useState(false);
  const [userName, setUserName] = useState('');
  const [fileValue, setFileValue] = useState<File | null>(null);

  useEffect(() => {
    socket.connect();
    const onConnect = () => {
      setIsConnected(true);
    };
    const onDisconnect = () => {
      setIsConnected(false);
      // @ts-ignore
      socket.io.reconnect();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    /////
    const onRequestUserId = () => {
      initializeSessionStorage();
      const meUser = getMeUser();
      if (!meUser) {
        setShouldRegister(true);
        return;
      }

      socket.emit(EventsNames.RECEIVE_USER_ID, { id: meUser.id });
    };
    socket.on(EventsNames.REQUEST_USER_ID, onRequestUserId);

    /////
    const onReceiveUsersList = (payload: User[]) => {
      const users = payload.map((user) => ({
        ...user,
        isMe: assignedUserId.current === user.id,
      }));
      rewriteState(users);
      setUsersList(users);
    };
    socket.on(EventsNames.RECEIVE_USERS_LIST, onReceiveUsersList);

    /////
    const onReceiveMessages = (payload: Message[]) => {
      setMessages(payload);
    };
    socket.on(EventsNames.RECEIVE_MESSAGES, onReceiveMessages);
    socket.on(EventsNames.SEND_MESSAGE, onReceiveMessages);

    /////
    const onCheckIfOnline = () => {
      socket.emit(EventsNames.GET_IS_USER_ONLINE, { userId: assignedUserId.current });
    };
    socket.on(EventsNames.GET_IS_USER_ONLINE, onCheckIfOnline);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(EventsNames.REQUEST_USER_ID, onRequestUserId);
      socket.off(EventsNames.RECEIVE_USERS_LIST, onReceiveUsersList);
      socket.off(EventsNames.RECEIVE_MESSAGES, onReceiveMessages);
      socket.off(EventsNames.SEND_MESSAGE, onReceiveMessages);
      socket.off(EventsNames.GET_IS_USER_ONLINE, onCheckIfOnline);
    };
  }, []);

  const onRegistrationSubmit = async () => {
    // validation/pic is off for now
    // const base64Image = await toBase64(fileValue!);
    const base64Image = null;
    const createdId = createId();

    socket.emit(EventsNames.REGISTER_USER, { id: createdId, name: userName, pic: base64Image || null });
    assignedUserId.current = createdId;
    sessionStorage.setItem(SESSION_STORAGE_USER_ID, JSON.stringify(createdId));
    setShouldRegister(false);
  };

  return children({
    users: usersList,
    messages,
    formProps: {
      inputValue: userName,
      setInputValue: setUserName,
      fileValue,
      setFileValue,
      onSubmit: onRegistrationSubmit,
      shouldOpenModal: shouldRegister,
    },
  });
};
