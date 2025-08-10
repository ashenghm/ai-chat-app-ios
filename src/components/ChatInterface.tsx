import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../graphql/queries';
import { createHttpClient } from '../graphql/client';
import { Message, ChatMessage, SendMessageVariables, ChatResponse } from '../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是 DeepSeek AI 助手，有什么可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // GraphQL mutation hook
  const [sendMessageMutation] = useMutation<{ sendMessage: ChatResponse }, SendMessageVariables>(SEND_MESSAGE);
  
  // HTTP 客户端用于流式请求
  const httpClient = createHttpClient();

  // 滚动到消息底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 转换消息格式：从 UI 消息格式转换为 API 消息格式
  const convertToApiMessages = (uiMessages: Message[]): ChatMessage[] => {
    return uiMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
  };

  // 使用 GraphQL 调用 DeepSeek API
  const callDeepSeekViaGraphQL = async (content: string): Promise<string> => {
    const apiMessages: ChatMessage[] = [
      // 系统提示
      {
        role: 'system',
        content: '你是一个有用的AI助手。请用简洁、友好的方式回答用户的问题。支持 Markdown 格式。'
      },
      // 历史消息（最近的 10 条）
      ...convertToApiMessages(messages.slice(-10)),
      // 当前用户消息
      {
        role: 'user',
        content: content
      }
    ];

    try {
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
    } catch (error: any) {
      console.error('GraphQL API 调用失败:', error);
      throw new Error(`API 调用失败: ${error.message}`);
    }
  };

  // 使用 HTTP 直接调用（用于流式响应）
  const callDeepSeekViaHTTP = async (content: string, useStream = false): Promise<string> => {
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

    try {
      const response = await httpClient.post('/api/chat', {
        messages: apiMessages,
        model: 'deepseek-chat',
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.95,
        stream: useStream,
      });

      return response.choices[0]?.message?.content || '抱歉，AI 服务暂时不可用。';
    } catch (error: any) {
      console.error('HTTP API 调用失败:', error);
      throw new Error(`API 调用失败: ${error.message}`);
    }
  };

  // 处理发送消息
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 清除之前的错误
    setError(null);

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
      // 选择使用 GraphQL 还是 HTTP 直接调用
      // 这里默认使用 GraphQL，您可以根据需要切换
      const useGraphQL = true;
      
      let aiResponse: string;
      
      if (useGraphQL) {
        aiResponse = await callDeepSeekViaGraphQL(content);
      } else {
        aiResponse = await callDeepSeekViaHTTP(content);
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
    }
  };

  // 清除错误消息
  const clearError = () => {
    setError(null);
  };

  return (
    <div className="chat-container">
      {/* 聊天头部 */}
      <div className="chat-header">
        <h1 className="chat-title">DeepSeek AI 助手</h1>
        {error && (
          <div className="error-banner" onClick={clearError}>
            <span className="error-text">⚠️ {error}</span>
            <span className="error-close">✕</span>
          </div>
        )}
      </div>

      {/* 消息列表 */}
      <div className="chat-messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping}
        placeholder={isTyping ? "AI 正在思考..." : "输入消息..."}
      />
    </div>
  );
};

export default ChatInterface;