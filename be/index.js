"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const eventsNames_1 = require("./src/eventsNames");
const connectedUsersMap_1 = require("./src/connectedUsersMap");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const io = new socket_io_1.Server(http_1.default.createServer(app), {
    cors: {
        origin: 'http://localhost:3000',
    },
});
io.listen(4001);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
io.on('connection', (socket) => {
    // console.log('a user connected' + ' ' + socket.id);
    io.emit(eventsNames_1.EventsNames.REQUEST_USER_ID);
    socket.on(eventsNames_1.EventsNames.REGISTER_USER, ({ id, name, pic }) => {
        connectedUsersMap_1.connectedUsers.push({ id, name, pic, messages: [] });
        socket.emit(eventsNames_1.EventsNames.RECEIVE_STATE, connectedUsersMap_1.connectedUsers);
    });
    socket.on(eventsNames_1.EventsNames.REQUEST_STATE, () => {
        socket.emit(eventsNames_1.EventsNames.REQUEST_STATE, connectedUsersMap_1.connectedUsers);
    });
    socket.on(eventsNames_1.EventsNames.RECEIVE_USER_ID, (payload) => {
        if (payload.id) {
            socket.emit(eventsNames_1.EventsNames.RECEIVE_STATE, connectedUsersMap_1.connectedUsers);
        }
    });
    socket.on(eventsNames_1.EventsNames.SEND_MESSAGE, (payload) => {
        const foo = connectedUsersMap_1.connectedUsers.map((user) => {
            if (user.id === payload.to) {
                return Object.assign(Object.assign({}, user), { messages: [
                        ...user.messages,
                        {
                            senderId: payload.senderId,
                            message: payload.message,
                            attachments: payload.attachments,
                            receiverId: payload.to,
                            timestamp: payload.timestamp,
                        },
                    ] });
            }
            return user;
        });
        connectedUsersMap_1.connectedUsers.length = 0;
        connectedUsersMap_1.connectedUsers.push(...foo);
        socket.emit(eventsNames_1.EventsNames.RECEIVE_STATE, connectedUsersMap_1.connectedUsers);
    });
    socket.on('disconnect', () => {
        // connectedUsers = connectedUsers.filter((user) => user.id !== socket.id)
        console.log('user disconnected');
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
