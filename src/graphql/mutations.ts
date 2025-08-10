import { gql } from '@apollo/client';

// 发送消息
export const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $conversationId: ID) {
    sendMessage(content: $content, conversationId: $conversationId) {
      id
      content
      sender
      timestamp
      conversation {
        id
      }
    }
  }
`;

// 创建新对话
export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($title: String) {
    createConversation(title: $title) {
      id
      title
      createdAt
    }
  }
`;

// 删除消息
export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      success
      message
    }
  }
`;

// 更新消息
export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($id: ID!, $content: String!) {
    updateMessage(id: $id, content: $content) {
      id
      content
      updatedAt
    }
  }
`;

// 删除对话
export const DELETE_CONVERSATION = gql`
  mutation DeleteConversation($id: ID!) {
    deleteConversation(id: $id) {
      success
      message
    }
  }
`;
