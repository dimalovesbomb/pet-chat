import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { EventsNames } from './src/eventsNames';
import { onlineUsers } from './src/connectedUsersMap';
import { Message, RegisterPayload, RequestMessagePayload } from './src/types';
import { DBLike } from './src/databaseLikeThingie';

dotenv.config();

const DB = new DBLike();
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
  // DB.removeOfflineUsers(onlineUsers);

  socket.on(EventsNames.REGISTER_USER, ({ id, name, pic }: RegisterPayload) => {
    DB.registerUser({ id, name, pic });
    onlineUsers[id] = socket.id;
    const userList = DB.getConnectedUsers();
    // to all sockets
    io.emit(EventsNames.RECEIVE_USERS_LIST, userList);
  });

  socket.on(EventsNames.RECEIVE_USER_ID, (payload: { id: string }) => {
    onlineUsers[payload.id] = socket.id;
    const connectedUsers = DB.getConnectedUsers();

    socket.emit(EventsNames.RECEIVE_USERS_LIST, connectedUsers);
  });

  socket.on(EventsNames.REQUEST_USERS_LIST, () => {
    const userList = DB.getConnectedUsers().map(({ name, id, pic }) => ({
      name,
      id,
      pic,
    }));

    socket.emit(EventsNames.RECEIVE_USERS_LIST, userList);
  });

  socket.on(EventsNames.REQUEST_MESSAGES, ({ requester, messagesOfUser }: RequestMessagePayload) => {
    const messagesOfRequesterToTargetUser =
      DB.getUser(requester)?.messages.filter((message) => message.to === messagesOfUser) || [];
    const messagesOfTargetUserToRequester =
      DB.getUser(messagesOfUser)?.messages.filter((message) => message.to === 'all' || message.to === requester) || [];
    // should be sorted by timestamp
    const messages = [...messagesOfRequesterToTargetUser, ...messagesOfTargetUserToRequester];
    messages.sort((a, b) => {
      if (a.timestamp > b.timestamp) return 1;
      if (b.timestamp > a.timestamp) return -1;
      return 0;
    });
    // send only to a requester client
    socket.emit(EventsNames.RECEIVE_MESSAGES, messages);
  });

  // to be refactored
  socket.on(EventsNames.SEND_MESSAGE, (payload: Message) => {
    DB.addMessage(payload);

    const messagesOfRequesterToTargetUser =
      DB.getUser(payload.senderId)?.messages.filter((message) => message.to === payload.to) || [];
    const messagesOfTargetUserToRequester =
      DB.getUser(payload.to)?.messages.filter((message) => message.to === 'all' || message.to === payload.senderId) ||
      [];
    const messages = [...messagesOfRequesterToTargetUser, ...messagesOfTargetUserToRequester];
    messages.sort((a, b) => {
      if (a.timestamp > b.timestamp) return 1;
      if (b.timestamp > a.timestamp) return -1;
      return 0;
    });

    io.emit(EventsNames.SEND_MESSAGE, messages);
  });

  setInterval(() => {
    io.emit(EventsNames.GET_IS_USER_ONLINE);
  }, 10000);
  socket.on(EventsNames.GET_IS_USER_ONLINE, (payload: { userId: string }) => {
    onlineUsers[payload.userId] = socket.id;
  });

  socket.on('disconnect', () => {
    for (const key in onlineUsers) {
      if (onlineUsers[key] === socket.id) {
        // DB.deleteUser(key);
        delete onlineUsers[key];
      }
    }
    io.emit(EventsNames.RECEIVE_USERS_LIST, DB.getConnectedUsers());
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
