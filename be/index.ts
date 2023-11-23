import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { EventsNames } from './src/eventsNames';
import { connectedUsers, getOnlineUsersOnly, onlineUsers } from './src/connectedUsersMap';
import { Message, RegisterPayload, RequestMessagePayload } from './src/types';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;
const io = new Server(http.createServer(app), {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.listen(4001);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

io.on('connection', (socket) => {
  io.emit(EventsNames.REQUEST_USER_ID);

  socket.on(EventsNames.REGISTER_USER, ({ id, name, pic }: RegisterPayload) => {
    connectedUsers[id] = { id, name, pic, messages: [] };
    onlineUsers[id] = socket.id;
    const userList = Object.values(connectedUsers).map(({ name, id, pic }) => ({
      name,
      id,
      pic,
    }));
    // to all sockets
    io.emit(EventsNames.RECEIVE_USERS_LIST, userList);
  });

  socket.on(EventsNames.RECEIVE_USER_ID, (payload: { id: string }) => {
    onlineUsers[payload.id] = socket.id;
    socket.emit(EventsNames.RECEIVE_USERS_LIST, getOnlineUsersOnly());
  });

  socket.on(EventsNames.REQUEST_USERS_LIST, () => {
    const userList = getOnlineUsersOnly().map(({ name, id, pic }) => ({
      name,
      id,
      pic,
    }));
    socket.emit(EventsNames.RECEIVE_USERS_LIST, userList);
  });

  socket.on(EventsNames.REQUEST_MESSAGES, ({ requester, messagesOfUser }: RequestMessagePayload) => {
    const messagesOfRequesterToTargetUser =
      connectedUsers[requester]?.messages.filter((message) => message.senderId === messagesOfUser) || [];
    const messagesOfTargetUserToRequester = connectedUsers[messagesOfUser].messages.filter(
      (message) => message.to === 'all' || message.to === requester,
    );
    // should be sorted by timestamp
    const bunch = [...messagesOfRequesterToTargetUser, ...messagesOfTargetUserToRequester];
    // send only to a requester client
    socket.emit(EventsNames.RECEIVE_MESSAGES, bunch);
  });

  // to be refactored
  socket.on(EventsNames.SEND_MESSAGE, (payload: Message) => {
    connectedUsers[payload.senderId].messages.push({
      to: payload.to,
      senderId: payload.senderId,
      message: payload.message,
      attachments: payload.attachments,
      timestamp: payload.timestamp,
    });

    const state = Object.values(connectedUsers);
    socket.emit(EventsNames.RECEIVE_STATE, state);
  });

  socket.on(EventsNames.GET_IS_USER_ONLINE, (payload: { userId: string }) => {
    onlineUsers[payload.userId] = socket.id;
  });

  socket.on('disconnect', () => {
    for (const key in onlineUsers) {
      if (onlineUsers[key] === socket.id) {
        delete onlineUsers[key];
      }
    }
    io.emit(EventsNames.RECEIVE_USERS_LIST, getOnlineUsersOnly());
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
