"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnlineUsersOnly = exports.onlineUsers = exports.connectedUsers = void 0;
exports.connectedUsers = {
    '007': {
        id: '007',
        name: 'Mirror bot',
        pic: null,
        messages: [
            {
                senderId: '007',
                message: `Hi! I'm a mirror bot! Send me anything here and I'll send it back to you right away!`,
                attachments: null,
                timestamp: Date.now(),
                to: 'all',
            },
        ],
    },
};
exports.onlineUsers = { '007': 'always online' };
const getOnlineUsersOnly = () => {
    const onlineOnlyKeys = Object.keys(exports.onlineUsers);
    return onlineOnlyKeys.map((key) => exports.connectedUsers[key]);
};
exports.getOnlineUsersOnly = getOnlineUsersOnly;
