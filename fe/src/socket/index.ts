import { io } from 'socket.io-client';
import { EventsNames } from './eventsNames';
import { SendMessage } from '../shared/types';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
const URL = 'http://localhost:4001';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
});

export const sendMessage = (message: SendMessage) => {
  socket.emit(EventsNames.SEND_MESSAGE, message);
};

export const getMessages = (requester: string, messagesOfUser: string) => {
  socket.emit(EventsNames.REQUEST_MESSAGES, { requester, messagesOfUser });
};
