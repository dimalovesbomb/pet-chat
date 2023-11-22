import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { EventsNames } from './src/eventsNames';
import { connectedUsers } from './src/connectedUsersMap';
import { RegisterPayload, SendMessage } from './src/types';

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
    connectedUsers.push({ id, name, pic, messages: [] });
    socket.emit(EventsNames.RECEIVE_STATE, connectedUsers);
  });

  socket.on(EventsNames.REQUEST_STATE, () => {
    socket.emit(EventsNames.REQUEST_STATE, connectedUsers);
  });

  socket.on(EventsNames.RECEIVE_USER_ID, (payload: { id: string }) => {
    if (payload.id) {
      socket.emit(EventsNames.RECEIVE_STATE, connectedUsers);
    }
  });

  socket.on(EventsNames.SEND_MESSAGE, (payload: SendMessage) => {
    const foo = connectedUsers.map((user) => {
      if (user.id === payload.to) {
        return {
          ...user,
          messages: [
            ...user.messages,
            {
              senderId: payload.senderId,
              message: payload.message,
              attachments: payload.attachments,
              receiverId: payload.to,
              timestamp: payload.timestamp,
            },
          ],
        };
      }
      return user;
    });
    connectedUsers.length = 0;
    connectedUsers.push(...foo);

    socket.emit(EventsNames.RECEIVE_STATE, connectedUsers);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
