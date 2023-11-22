export interface Attachment {
  type: string;
  src: string;
}

export interface Message {
  senderId: string;
  message: string;
  attachments: Attachment[] | null;
  timestamp: number;
}

export type SendMessage = Message & {
  to: string;
};

export interface User {
  id: string;
  name: string;
  pic: string | null;
  messages: Message[];
  friendList?: unknown;
}

export interface RegisterPayload {
  id: string;
  name: string;
  pic: string | null;
}
