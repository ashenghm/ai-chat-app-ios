// 基础消息类型
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// OpenAI/DeepSeek API 兼容的消息类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 聊天状态
export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
}

// DeepSeek API 请求参数
export interface ChatInput {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  stream?: boolean;
}

// DeepSeek API 响应类型
export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
}

export interface Choice {
  index: number;
  message: ChatMessage;
  finish_reason: string | null;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// GraphQL 响应类型
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

// 健康检查响应
export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

// 聊天历史记录
export interface ChatLogEntry {
  timestamp: string;
  model: string;
  messagesCount: number;
  tokensUsed: Usage;
}

// GraphQL 查询变量类型
export interface SendMessageVariables {
  input: ChatInput;
}

export interface GetChatHistoryVariables {
  limit?: number;
  offset?: number;
}

// 应用配置
export interface AppConfig {
  apiUrl: string;
  graphqlUrl: string;
  apiBaseUrl: string;
  environment: string;
  appName: string;
  version: string;
  debug: boolean;
}

// 错误类型
export interface ApiError {
  error: string;
  timestamp: string;
}

// 环境变量类型
export interface Environment {
  DEEPSEEK_API_KEY: string;
  DEFAULT_MODEL?: string;
  MAX_TOKENS?: string;
  ALLOWED_ORIGINS?: string;
  CHAT_HISTORY?: any;
}

// 流式响应处理
export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

// React Hook 返回类型
export interface UseChatReturn {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  error: string | null;
}

// 组件 Props 类型
export interface MessageBubbleProps {
  message: Message;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface TypingIndicatorProps {
  show: boolean;
}

export interface ChatInterfaceProps {
  title?: string;
  initialMessages?: Message[];
  onMessageSent?: (message: Message) => void;
  onMessageReceived?: (message: Message) => void;
}