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
const databaseLikeThingie_1 = require("./src/databaseLikeThingie");
dotenv_1.default.config();
const DB = new databaseLikeThingie_1.DBLike();
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
    // DB.removeOfflineUsers(onlineUsers);
    socket.on(eventsNames_1.EventsNames.REGISTER_USER, ({ id, name, pic }) => {
        DB.registerUser({ id, name, pic });
        connectedUsersMap_1.onlineUsers[id] = socket.id;
        const userList = DB.getConnectedUsers();
        // console.log({ at: 'socket.on(EventsNames.REGISTER_USER', onlineUsers });
        // to all sockets
        io.emit(eventsNames_1.EventsNames.RECEIVE_USERS_LIST, userList);
    });
    socket.on(eventsNames_1.EventsNames.RECEIVE_USER_ID, (payload) => {
        connectedUsersMap_1.onlineUsers[payload.id] = socket.id;
        const connectedUsers = DB.getConnectedUsers();
        // console.log({ at: 'socket.on(EventsNames.RECEIVE_USER_ID', onlineUsers });
        socket.emit(eventsNames_1.EventsNames.RECEIVE_USERS_LIST, connectedUsers);
    });
    socket.on(eventsNames_1.EventsNames.REQUEST_USERS_LIST, () => {
        const userList = DB.getConnectedUsers().map(({ name, id, pic }) => ({
            name,
            id,
            pic,
        }));
        // console.log({ at: 'socket.on(EventsNames.REQUEST_USERS_LIST', onlineUsers });
        socket.emit(eventsNames_1.EventsNames.RECEIVE_USERS_LIST, userList);
    });
    socket.on(eventsNames_1.EventsNames.REQUEST_MESSAGES, ({ requester, messagesOfUser }) => {
        var _a, _b;
        const messagesOfRequesterToTargetUser = ((_a = DB.getUser(requester)) === null || _a === void 0 ? void 0 : _a.messages.filter((message) => message.to === messagesOfUser)) || [];
        const messagesOfTargetUserToRequester = ((_b = DB.getUser(messagesOfUser)) === null || _b === void 0 ? void 0 : _b.messages.filter((message) => message.to === 'all' || message.to === requester)) || [];
        // should be sorted by timestamp
        const messages = [...messagesOfRequesterToTargetUser, ...messagesOfTargetUserToRequester];
        messages.sort((a, b) => {
            if (a.timestamp > b.timestamp)
                return 1;
            if (b.timestamp > a.timestamp)
                return -1;
            return 0;
        });
        // console.log({ at: 'socket.on(EventsNames.REQUEST_MESSAGES', onlineUsers });
        // send only to a requester client
        socket.emit(eventsNames_1.EventsNames.RECEIVE_MESSAGES, messages);
    });
    // to be refactored
    socket.on(eventsNames_1.EventsNames.SEND_MESSAGE, (payload) => {
        var _a, _b;
        DB.addMessage(payload);
        console.log('in handler');
        const messagesOfRequesterToTargetUser = ((_a = DB.getUser(payload.senderId)) === null || _a === void 0 ? void 0 : _a.messages.filter((message) => message.to === payload.to)) || [];
        const messagesOfTargetUserToRequester = ((_b = DB.getUser(payload.to)) === null || _b === void 0 ? void 0 : _b.messages.filter((message) => message.to === 'all' || message.to === payload.senderId)) ||
            [];
        console.log(messagesOfTargetUserToRequester);
        // should be sorted by timestamp
        const messages = [...messagesOfRequesterToTargetUser, ...messagesOfTargetUserToRequester];
        messages.sort((a, b) => {
            if (a.timestamp > b.timestamp)
                return 1;
            if (b.timestamp > a.timestamp)
                return -1;
            return 0;
        });
        // console.log({ at: 'socket.on(EventsNames.SEND_MESSAGE', onlineUsers });
        io.emit(eventsNames_1.EventsNames.SEND_MESSAGE, messages);
    });
    setInterval(() => {
        io.emit(eventsNames_1.EventsNames.GET_IS_USER_ONLINE);
    }, 10000);
    socket.on(eventsNames_1.EventsNames.GET_IS_USER_ONLINE, (payload) => {
        connectedUsersMap_1.onlineUsers[payload.userId] = socket.id;
        // console.log({ at: 'socket.on(EventsNames.GET_IS_USER_ONLINE', onlineUsers });
    });
    socket.on('disconnect', () => {
        for (const key in connectedUsersMap_1.onlineUsers) {
            if (connectedUsersMap_1.onlineUsers[key] === socket.id) {
                // DB.deleteUser(key);
                delete connectedUsersMap_1.onlineUsers[key];
            }
        }
        io.emit(eventsNames_1.EventsNames.RECEIVE_USERS_LIST, DB.getConnectedUsers());
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
