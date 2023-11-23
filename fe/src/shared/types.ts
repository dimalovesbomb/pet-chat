export interface User {
  name: string;
  id: string;
  pic: string | null;
  isMe?: boolean;
}

export interface Attachment {
  type: string;
  src: string;
}

export interface Message {
  senderId: string;
  message: string;
  attachments: Attachment[] | null;
  timestamp: number;
  to: string;
}

export type SendMessage = Message & {
  to: string;
};

export interface State {
  id: string;
  name: string;
  pic: string | null;
  // messages: Message[];
  isMe?: boolean;
}
