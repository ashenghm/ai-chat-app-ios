import { gql } from '@apollo/client';

// 查询所有消息
export const GET_MESSAGES = gql`
  query GetMessages($limit: Int, $offset: Int) {
    messages(limit: $limit, offset: $offset) {
      id
      content
      sender
      timestamp
    }
  }
`;

// 查询单个对话的消息
export const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($conversationId: ID!, $limit: Int, $offset: Int) {
    conversation(id: $conversationId) {
      id
      messages(limit: $limit, offset: $offset) {
        id
        content
        sender
        timestamp
      }
    }
  }
`;

// 查询对话列表
export const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      id
      title
      updatedAt
      lastMessage {
        content
        timestamp
      }
    }
  }
`;
