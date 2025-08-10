# DeepSeek API 集成使用指南

本指南介绍如何使用基于 OpenAI SDK 兼容格式的 DeepSeek API 进行聊天功能开发。

## 📋 项目概述

本项目提供了两种方式与 DeepSeek API 交互：

1. **GraphQL 接口** - 结构化查询，类型安全
2. **REST API 接口** - 直接兼容 OpenAI SDK 格式

## 🔧 API 格式对比

### OpenAI SDK 原始示例
```javascript
import OpenAI from "openai";

const openai = new OpenAI({ 
  baseURL: 'https://api.deepseek.com', 
  apiKey: 'your-deepseek-api-key'
});

const completion = await openai.chat.completions.create({
  messages: [{ 
    role: "system", 
    content: "You are a helpful assistant." 
  }],
  model: "deepseek-chat",
});
```

### 我们的 REST API 实现
```javascript
// 直接 HTTP 调用
const response = await fetch('https://your-worker.workers.dev/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ 
      role: "system", 
      content: "You are a helpful assistant." 
    }],
    model: "deepseek-chat",
    max_tokens: 2000,
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### 我们的 GraphQL 实现
```javascript
// GraphQL Mutation
const SEND_MESSAGE = gql`
  mutation SendMessage($input: ChatInput!) {
    sendMessage(input: $input) {
      id
      choices {
        message {
          content
        }
      }
      usage {
        total_tokens
      }
    }
  }
`;

const { data } = await sendMessage({
  variables: {
    input: {
      messages: [{ 
        role: "system", 
        content: "You are a helpful assistant." 
      }],
      model: "deepseek-chat"
    }
  }
});
```

## 🚀 快速开始

### 1. 后端部署 (Cloudflare Workers)

```bash
# 克隆后端项目
git clone https://github.com/ashenghm/cloudflare-deepseek-chat-api.git
cd cloudflare-deepseek-chat-api

# 安装依赖
npm install

# 设置环境变量
wrangler secret put DEEPSEEK_API_KEY

# 部署
wrangler deploy
```

### 2. 前端设置 (React App)

```bash
# 克隆前端项目
git clone https://github.com/ashenghm/ai-chat-app-ios.git
cd ai-chat-app-ios

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 Worker URL

# 启动开发服务器
npm run start:example
```

## 🔗 API 端点说明

### REST API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/chat` | POST | 发送聊天消息（OpenAI 兼容） |
| `/api/health` | GET | 健康检查 |
| `/api/stats` | GET | 使用统计 |

### GraphQL 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/graphql` | POST | GraphQL 查询和变更 |

### GraphQL Schema

```graphql
type Mutation {
  sendMessage(input: ChatInput!): ChatResponse!
}

type Query {
  health: HealthStatus!
  chatHistory(limit: Int): [ChatLogEntry!]!
}

input ChatInput {
  messages: [MessageInput!]!
  model: String
  max_tokens: Int
  temperature: Float
  top_p: Float
  stream: Boolean
}
```

## 📝 使用示例

### 1. React Hook 使用

```javascript
import { useChat } from './hooks/useChat';

function ChatComponent() {
  const { messages, sendMessage, isTyping } = useChat([
    {
      id: '1',
      content: '你好！我是 DeepSeek AI 助手',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const handleSend = async (content) => {
    await sendMessage(content);
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      {isTyping && <div>AI 正在输入...</div>}
      <input onSubmit={handleSend} />
    </div>
  );
}
```

### 2. 直接 API 调用

```javascript
// REST API 调用
async function callDeepSeekAPI(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      model: 'deepseek-chat',
      max_tokens: 1000,
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// GraphQL 调用
async function callDeepSeekGraphQL(message) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation SendMessage($input: ChatInput!) {
          sendMessage(input: $input) {
            choices {
              message {
                content
              }
            }
          }
        }
      `,
      variables: {
        input: {
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: message }
          ],
          model: 'deepseek-chat'
        }
      }
    })
  });
  
  const data = await response.json();
  return data.data.sendMessage.choices[0].message.content;
}
```

### 3. 流式响应

```javascript
async function streamingChat(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }],
      stream: true
    })
  });

  const reader = response.body.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = new TextDecoder().decode(value);
    console.log('Received chunk:', chunk);
  }
}
```

## ⚙️ 配置选项

### 环境变量

**后端 (Cloudflare Workers):**
- `DEEPSEEK_API_KEY` - DeepSeek API 密钥
- `DEFAULT_MODEL` - 默认模型名称
- `MAX_TOKENS` - 最大令牌数

**前端 (React App):**
- `REACT_APP_GRAPHQL_URI` - GraphQL 端点 URL
- `REACT_APP_API_BASE_URL` - REST API 基础 URL
- `REACT_APP_USE_GRAPHQL` - 是否使用 GraphQL

### DeepSeek API 参数

```javascript
{
  model: "deepseek-chat",           // 模型名称
  messages: [...],                  // 消息数组
  max_tokens: 2000,                // 最大输出令牌数
  temperature: 0.7,                // 创造性控制 (0-2)
  top_p: 0.95,                     // 核采样参数
  frequency_penalty: 0,            // 频率惩罚
  presence_penalty: 0,             // 存在惩罚
  stop: ["\\n"],                   // 停止序列
  stream: false                    // 是否流式输出
}
```

## 🔍 测试和调试

### 运行测试脚本

```bash
# 测试后端 API
chmod +x test-deepseek-api.sh
./test-deepseek-api.sh https://your-worker.workers.dev

# 测试前端应用
npm test
```

### 调试技巧

1. **检查网络请求** - 使用浏览器开发者工具查看 API 调用
2. **查看 Worker 日志** - 使用 `wrangler tail` 实时查看日志
3. **GraphQL Playground** - 访问 `/api/graphql` 进行交互式查询

## 🚨 错误处理

### 常见错误及解决方案

1. **API Key 错误**
   ```
   Error: DeepSeek API key 未配置
   Solution: 检查环境变量 DEEPSEEK_API_KEY
   ```

2. **CORS 错误**
   ```
   Error: Access to fetch blocked by CORS
   Solution: 检查 ALLOWED_ORIGINS 配置
   ```

3. **GraphQL 错误**
   ```
   Error: Unsupported GraphQL operation
   Solution: 检查查询语法和变量类型
   ```

## 📊 性能优化

1. **缓存策略** - 使用 KV 存储缓存常见查询
2. **请求去重** - 防止重复发送相同请求
3. **流式响应** - 对于长文本生成使用流式输出
4. **错误重试** - 实现指数退避重试策略

## 🔐 安全最佳实践

1. **API Key 管理** - 永远不要在前端暴露 API Key
2. **请求验证** - 在后端验证所有输入参数
3. **速率限制** - 实现基于 IP 的请求限制
4. **日志记录** - 记录所有 API 调用用于监控

## 📚 更多资源

- [DeepSeek API 文档](https://platform.deepseek.com/api-docs/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [GraphQL 规范](https://graphql.org/learn/)
- [React Apollo 文档](https://www.apollographql.com/docs/react/)

---

如有任何问题，请提交 GitHub Issue 或查看项目文档！