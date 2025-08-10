import { gql } from '@apollo/client';

// 查询健康状态
export const GET_HEALTH = gql`
  query GetHealth {
    health {
      status
      timestamp
      service
      version
    }
  }
`;

// 查询聊天历史
export const GET_CHAT_HISTORY = gql`
  query GetChatHistory($limit: Int, $offset: Int) {
    chatHistory(limit: $limit, offset: $offset) {
      timestamp
      model
      messagesCount
      tokensUsed {
        prompt_tokens
        completion_tokens
        total_tokens
      }
    }
  }
`;

// 发送消息的 Mutation
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: ChatInput!) {
    sendMessage(input: $input) {
      id
      object
      created
      model
      choices {
        index
        message {
          role
          content
        }
        finish_reason
      }
      usage {
        prompt_tokens
        completion_tokens
        total_tokens
      }
    }
  }
`;

// Fragment 定义
export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on Message {
    role
    content
  }
`;

export const CHOICE_FRAGMENT = gql`
  fragment ChoiceFields on Choice {
    index
    message {
      ...MessageFields
    }
    finish_reason
  }
  ${MESSAGE_FRAGMENT}
`;

export const USAGE_FRAGMENT = gql`
  fragment UsageFields on Usage {
    prompt_tokens
    completion_tokens
    total_tokens
  }
`;

export const CHAT_RESPONSE_FRAGMENT = gql`
  fragment ChatResponseFields on ChatResponse {
    id
    object
    created
    model
    choices {
      ...ChoiceFields
    }
    usage {
      ...UsageFields
    }
  }
  ${CHOICE_FRAGMENT}
  ${USAGE_FRAGMENT}
`;