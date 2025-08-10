import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../graphql/queries';
import { createHttpClient } from '../graphql/client';
import { Message, ChatMessage, SendMessageVariables, ChatResponse, UseChatReturn } from '../types';

// 自定义 Hook：使用 DeepSeek API 进行聊天
export const useChat = (initialMessages: Message[] = []): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GraphQL mutation
  const [sendMessageMutation] = useMutation<{ sendMessage: ChatResponse }, SendMessageVariables>(SEND_MESSAGE);
  
  // HTTP 客户端
  const httpClient = createHttpClient();

  // 转换消息格式
  const convertToApiMessages = useCallback((uiMessages: Message[]): ChatMessage[] => {
    return uiMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
  }, []);

  // 使用 GraphQL 发送消息
  const sendMessageViaGraphQL = useCallback(async (content: string): Promise<string> => {
    const apiMessages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一个有用的AI助手。请用简洁、友好的方式回答用户的问题。支持 Markdown 格式。'
      },
      ...convertToApiMessages(messages.slice(-10)),
      {
        role: 'user',
        content: content
      }
    ];

    const result = await sendMessageMutation({
      variables: {
        input: {
          messages: apiMessages,
          model: 'deepseek-chat',
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.95,
        }
      }
    });

    if (result.data?.sendMessage.choices[0]?.message.content) {
      return result.data.sendMessage.choices[0].message.content;
    } else {
      throw new Error('未收到有效的 AI 回复');
    }
  }, [messages, convertToApiMessages, sendMessageMutation]);

  // 使用 HTTP 直接发送消息
  const sendMessageViaHTTP = useCallback(async (content: string): Promise<string> => {
    const apiMessages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一个有用的AI助手。请用简洁、友好的方式回答用户的问题。支持 Markdown 格式。'
      },
      ...convertToApiMessages(messages.slice(-10)),
      {
        role: 'user',
        content: content
      }
    ];

    const response = await httpClient.post('/api/chat', {
      messages: apiMessages,
      model: 'deepseek-chat',
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.95,
    });

    return response.choices[0]?.message?.content || '抱歉，AI 服务暂时不可用。';
  }, [messages, convertToApiMessages, httpClient]);

  // 发送消息的主函数
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    setIsLoading(true);

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // 根据环境变量或配置选择使用 GraphQL 或 HTTP
      const useGraphQL = process.env.REACT_APP_USE_GRAPHQL !== 'false';
      
      let aiResponse: string;
      
      if (useGraphQL) {
        aiResponse = await sendMessageViaGraphQL(content);
      } else {
        aiResponse = await sendMessageViaHTTP(content);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('发送消息失败:', error);
      setError(error.message);
      
      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，我遇到了一些技术问题。请稍后再试。',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [sendMessageViaGraphQL, sendMessageViaHTTP]);

  // 清除所有消息
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isTyping,
    isLoading,
    sendMessage,
    clearMessages,
    error,
  };
};

// 自定义 Hook：聊天历史记录
export const useChatHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (limit = 10, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const httpClient = createHttpClient();
      const response = await httpClient.get(`/api/stats`);
      setHistory(response.recentChats || []);
    } catch (err: any) {
      setError(err.message);
      console.error('获取聊天历史失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    history,
    loading,
    error,
    fetchHistory,
  };
};

// 自定义 Hook：API 健康状态检查
export const useHealthCheck = () => {
  const [status, setStatus] = useState<'unknown' | 'healthy' | 'unhealthy'>('unknown');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const httpClient = createHttpClient();
      const response = await httpClient.get('/api/health');
      setStatus(response.status === 'healthy' ? 'healthy' : 'unhealthy');
    } catch (err: any) {
      setStatus('unhealthy');
      setError(err.message);
      console.error('健康检查失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    status,
    loading,
    error,
    checkHealth,
  };
};