export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
}

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
  }>;
}

export interface SendMessageResponse {
  sendMessage: {
    id: string;
    content: string;
    timestamp: string;
  };
}

export interface GetMessagesResponse {
  messages: Array<{
    id: string;
    content: string;
    sender: string;
    timestamp: string;
  }>;
}
