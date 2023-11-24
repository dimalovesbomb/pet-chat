import fs from 'fs';
import path from 'path';
import type { Message, User } from '../types';

interface ICreateEmptyUser {
  id: string;
  name: string;
  pic: string | null;
}

export class DBLike {
  private createEmptyUser({ id, name, pic }: ICreateEmptyUser): User {
    return {
      id,
      name,
      pic,
      messages: [],
    };
  }
  private getFilePath(fileId?: string) {
    if (!fileId) return path.join(__dirname);
    return path.join(__dirname, `${fileId}.json`);
  }

  private writeToFile(fileId: string, userData: User) {
    const data = JSON.stringify(userData);
    fs.writeFileSync(this.getFilePath(fileId), data, { encoding: 'utf8' });
  }

  registerUser({ id, name, pic }: ICreateEmptyUser) {
    const newUserStrigified = JSON.stringify(this.createEmptyUser({ id, name, pic }));
    fs.writeFileSync(this.getFilePath(id), newUserStrigified, { encoding: 'utf8' });
  }

  deleteUser(id: string) {
    fs.unlinkSync(this.getFilePath(id));
  }

  getUser(userId: string): User | null {
    const userString = fs.readFileSync(this.getFilePath(userId), 'utf8');

    try {
      const userObject = JSON.parse(userString);
      return userObject;
    } catch {
      return null;
    }
  }

  addMessage(message: Message): void {
    const senderUser = this.getUser(message.senderId);
    if (senderUser) {
      const newUserData: User = { ...senderUser, messages: [...senderUser.messages, message] };
      this.writeToFile(message.senderId, newUserData);
    }
  }

  getConnectedUsers() {
    const files = fs.readdirSync(this.getFilePath());
    const users = files
      .filter((fileName) => fileName.split('.').pop() === 'json')
      .map((fileName) => {
        const fileNameWithNoExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const user = this.getUser(fileNameWithNoExtension);

        return user
          ? {
              id: user.id,
              name: user?.name,
              pic: user?.pic,
            }
          : {};
      });

    return users;
  }

  removeOfflineUsers(listOfOnlineUsers: Record<string, string>) {
    const allDirFiles = fs.readdirSync(this.getFilePath());
    const allUsersFiles = allDirFiles.filter((fileName) => fileName.split('.').pop() === 'json');
    const onlineUsersIds = Object.keys(listOfOnlineUsers);

    allUsersFiles.forEach((fileName) => {
      if (!onlineUsersIds.includes(fileName) && fileName !== '007.json') {
        fs.unlinkSync(path.join(__dirname, fileName));
      }
    });
  }
}
