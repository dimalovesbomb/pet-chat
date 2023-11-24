"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBLike = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DBLike {
    createEmptyUser({ id, name, pic }) {
        return {
            id,
            name,
            pic,
            messages: [],
        };
    }
    getFilePath(fileId) {
        if (!fileId)
            return path_1.default.join(__dirname);
        return path_1.default.join(__dirname, `${fileId}.json`);
    }
    writeToFile(fileId, userData) {
        const data = JSON.stringify(userData);
        fs_1.default.writeFileSync(this.getFilePath(fileId), data, { encoding: 'utf8' });
    }
    registerUser({ id, name, pic }) {
        const newUserStrigified = JSON.stringify(this.createEmptyUser({ id, name, pic }));
        fs_1.default.writeFileSync(this.getFilePath(id), newUserStrigified, { encoding: 'utf8' });
    }
    deleteUser(id) {
        fs_1.default.unlinkSync(this.getFilePath(id));
    }
    getUser(userId) {
        const userString = fs_1.default.readFileSync(this.getFilePath(userId), 'utf8');
        try {
            const userObject = JSON.parse(userString);
            return userObject;
        }
        catch (_a) {
            return null;
        }
    }
    addMessage(message) {
        const senderUser = this.getUser(message.senderId);
        if (senderUser) {
            const newUserData = Object.assign(Object.assign({}, senderUser), { messages: [...senderUser.messages, message] });
            this.writeToFile(message.senderId, newUserData);
        }
    }
    getConnectedUsers() {
        const files = fs_1.default.readdirSync(this.getFilePath());
        const users = files
            .filter((fileName) => fileName.split('.').pop() === 'json')
            .map((fileName) => {
            const fileNameWithNoExtension = fileName.substring(0, fileName.lastIndexOf('.'));
            const user = this.getUser(fileNameWithNoExtension);
            return user
                ? {
                    id: user.id,
                    name: user === null || user === void 0 ? void 0 : user.name,
                    pic: user === null || user === void 0 ? void 0 : user.pic,
                }
                : {};
        });
        return users;
    }
    removeOfflineUsers(listOfOnlineUsers) {
        const allDirFiles = fs_1.default.readdirSync(this.getFilePath());
        const allUsersFiles = allDirFiles.filter((fileName) => fileName.split('.').pop() === 'json');
        const onlineUsersIds = Object.keys(listOfOnlineUsers);
        allUsersFiles.forEach((fileName) => {
            if (!onlineUsersIds.includes(fileName) && fileName !== '007.json') {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, fileName));
            }
        });
    }
}
exports.DBLike = DBLike;
