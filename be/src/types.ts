export interface Attachment {
  type: string;
  src: string;
}

export interface Message {
  to: string;
  senderId: string;
  message: string;
  attachments: Attachment[] | null;
  timestamp: number;
}

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

export interface RequestMessagePayload {
  requester: string;
  messagesOfUser: string;
}
