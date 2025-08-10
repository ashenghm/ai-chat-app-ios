import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../graphql/mutations';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [sendMessage] = useMutation(SEND_MESSAGE);

  // 滚动到消息底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 模拟AI回复（在实际应用中应该通过GraphQL调用AI服务）
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // 简单的模拟回复
    const responses = [
      `你说得很有趣！关于 \"${userMessage}\"，我想分享一些想法...`,
      `这是一个很好的问题。让我来帮你分析一下：\n\n**要点：**\n- 首先考虑主要因素\n- 然后分析次要因素\n- 最后得出结论`,
      `根据你的问题，我建议：\n\n\`\`\`javascript\nfunction solve() {\n  // 解决方案代码\n  return 'success';\n}\n\`\`\`\n\n这样应该能帮到你！`,
      `这让我想到了一个有趣的例子：\n\n> 正如某位智者所说："学习是一个持续的过程。"\n\n你觉得呢？`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

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
      // 在实际应用中，这里会调用GraphQL mutation
      // const result = await sendMessage({
      //   variables: { content: content.trim() }
      // });

      // 模拟AI回复
      const aiResponse = await simulateAIResponse(content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，发生了一个错误。请稍后再试。',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      {/* 聊天头部 */}
      <div className="chat-header">
        <h1 className="chat-title">AI 助手</h1>
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
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
