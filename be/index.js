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
    io.emit(eventsNames_1.EventsNames.REQUEST_USER_ID);
    //to be refactored
    socket.on(eventsNames_1.EventsNames.REGISTER_USER, ({ id, name, pic }) => {
        connectedUsersMap_1.connectedUsers[id] = { id, name, pic, messages: [] };
        const userList = Object.values(connectedUsersMap_1.connectedUsers).map(({ name, id, pic }) => ({
            name,
            id,
            pic,
        }));
        // to all sockets
        io.emit(eventsNames_1.EventsNames.RECEIVE_USERS_LIST, userList);
    });
    socket.on(eventsNames_1.EventsNames.RECEIVE_USER_ID, (payload) => {
        if (payload.id) {
            socket.emit(eventsNames_1.EventsNames.RECEIVE_USERS_LIST, Object.values(connectedUsersMap_1.connectedUsers));
        }
    });
    socket.on(eventsNames_1.EventsNames.REQUEST_USERS_LIST, () => {
        const userList = Object.values(connectedUsersMap_1.connectedUsers).map(({ name, id, pic }) => ({
            name,
            id,
            pic,
        }));
        socket.emit(eventsNames_1.EventsNames.RECEIVE_USERS_LIST, userList);
    });
    socket.on(eventsNames_1.EventsNames.REQUEST_MESSAGES, ({ requester, messagesOfUser }) => {
        var _a;
        const messagesOfRequesterToTargetUser = ((_a = connectedUsersMap_1.connectedUsers[requester]) === null || _a === void 0 ? void 0 : _a.messages.filter((message) => message.senderId === messagesOfUser)) || [];
        const messagesOfTargetUserToRequester = connectedUsersMap_1.connectedUsers[messagesOfUser].messages.filter((message) => message.to === 'all' || message.to === requester);
        // should be sorted by timestamp
        const bunch = [...messagesOfRequesterToTargetUser, ...messagesOfTargetUserToRequester];
        // send only to a requester client
        socket.emit(eventsNames_1.EventsNames.RECEIVE_MESSAGES, bunch);
    });
    // to be refactored
    socket.on(eventsNames_1.EventsNames.SEND_MESSAGE, (payload) => {
        connectedUsersMap_1.connectedUsers[payload.senderId].messages.push({
            to: payload.to,
            senderId: payload.senderId,
            message: payload.message,
            attachments: payload.attachments,
            timestamp: payload.timestamp,
        });
        const state = Object.values(connectedUsersMap_1.connectedUsers);
        socket.emit(eventsNames_1.EventsNames.RECEIVE_STATE, state);
    });
    socket.on(eventsNames_1.EventsNames.GET_IS_USER_ONLINE, (payload) => {
        console.log(payload);
    });
    socket.on('disconnect', () => {
        // const onlineUsers = io.sockets.sockets;
        io.emit(eventsNames_1.EventsNames.GET_IS_USER_ONLINE);
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
