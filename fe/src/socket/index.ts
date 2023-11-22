import { io, Socket } from 'socket.io-client';
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
});

export const sendMessage = (socketInstance: Socket, message: SendMessage) => {
  socketInstance.emit(EventsNames.SEND_MESSAGE, message);
};
