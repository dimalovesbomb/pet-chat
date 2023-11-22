import { User } from './types';

export let connectedUsers: User[] = [
  {
    id: '007',
    name: 'Mirror bot',
    pic: null,
    messages: [
      {
        senderId: '007',
        message: `Hi! I'm a mirror bot! Send me anything here and I'll send it back to you right away!`,
        attachments: null,
        timestamp: Date.now(),
      },
    ],
  },
];
