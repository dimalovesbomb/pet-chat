import React, { useEffect, useRef, useState } from 'react';
import { State} from '../../shared/types';
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
  users: State[];
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
  const [usersList, setUsersList] = useState<State[]>([]);

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
      socket.connect();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on(EventsNames.REQUEST_USER_ID, () => {
      initializeSessionStorage();
      const meUser = getMeUser();
      if (!meUser) {
        setShouldRegister(true);
        return;
      }

      socket.emit(EventsNames.RECEIVE_USER_ID, { id: meUser.id });
    });

    socket.on(EventsNames.RECEIVE_STATE, (payload: State[]) => {
      const users = payload.map((user) => ({
        ...user,
        isMe: assignedUserId.current === user.id,
      }));

      rewriteState(users);
      setUsersList(users);
    });

    return () => {
      socket.off('connect', () => setIsConnected(true));
      socket.off('disconnect', () => setIsConnected(false));
    };
  }, []);

  const onRegistrationSubmit = async () => {
    const base64Image = await toBase64(fileValue!);
    const createdId = createId();
    socket.emit(EventsNames.REGISTER_USER, { id: createdId, name: userName, pic: base64Image || null });
    assignedUserId.current = createdId;
    sessionStorage.setItem(SESSION_STORAGE_USER_ID, JSON.stringify(createdId));
    setShouldRegister(false);
  };

  return children({
    users: usersList,
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
