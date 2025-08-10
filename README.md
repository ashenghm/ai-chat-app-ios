# AI Chat App iOS Style

一个基于 TypeScript、React 和 GraphQL 的 iOS 风格 AI 聊天应用，支持 Markdown 渲染。

## 功能特性

- 🍎 **iOS 风格设计** - 完全模仿 iOS 消息应用的界面风格
- 💬 **实时聊天界面** - 流畅的聊天体验
- 📝 **Markdown 支持** - 支持完整的 Markdown 语法渲染
- 🔄 **GraphQL 集成** - 使用 Apollo Client 进行数据管理
- ⚡ **TypeScript** - 完整的类型安全
- 📱 **响应式设计** - 适配各种屏幕尺寸
- ✨ **打字指示器** - 实时显示 AI 正在输入
- 🎨 **代码高亮** - 支持多种编程语言的语法高亮

## 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Apollo Client + GraphQL
- **样式**: CSS3 (iOS 风格)
- **Markdown 渲染**: react-markdown + react-syntax-highlighter
- **构建工具**: Create React App

## 项目结构

```
ai-chat-app-ios/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/          # React 组件
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── graphql/            # GraphQL 相关
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   └── formatTime.ts
│   ├── App.tsx            # 主应用组件
│   ├── App.css            # 样式文件
│   ├── index.tsx          # 应用入口
│   └── index.css          # 全局样式
├── package.json
├── tsconfig.json
└── README.md
```

## 安装和运行

### 前置要求

- Node.js 16.0 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆项目

```bash
git clone https://github.com/ashenghm/ai-chat-app-ios.git
cd ai-chat-app-ios
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 环境配置

创建 `.env` 文件并配置 GraphQL 服务器地址：

```env
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
```

4. 启动开发服务器

```bash
npm start
# 或
yarn start
```

应用将在 http://localhost:3000 打开。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## GraphQL Schema 示例

项目使用以下 GraphQL schema：

```graphql
type Message {
  id: ID!
  content: String!
  sender: String!
  timestamp: String!
  conversation: Conversation
}

type Conversation {
  id: ID!
  title: String
  messages: [Message!]!
  createdAt: String!
  updatedAt: String!
}

type Query {
  messages(limit: Int, offset: Int): [Message!]!
  conversation(id: ID!): Conversation
  conversations: [Conversation!]!
}

type Mutation {
  sendMessage(content: String!, conversationId: ID): Message!
  createConversation(title: String): Conversation!
  deleteMessage(id: ID!): DeleteResult!
  updateMessage(id: ID!, content: String!): Message!
  deleteConversation(id: ID!): DeleteResult!
}

type DeleteResult {
  success: Boolean!
  message: String
}
```

## 组件说明

### ChatInterface
主聊天界面组件，管理消息状态和用户交互。

### MessageBubble
消息气泡组件，支持：
- Markdown 渲染
- 代码语法高亮
- 时间戳显示
- iOS 风格样式

### MessageInput
消息输入组件，支持：
- 自动调整高度的文本框
- Enter 键发送（Shift+Enter 换行）
- 发送按钮状态管理

### TypingIndicator
打字指示器组件，显示动画效果。

## 自定义配置

### 修改 AI 回复逻辑

在 `src/components/ChatInterface.tsx` 中的 `simulateAIResponse` 函数可以替换为真实的 AI API 调用：

```typescript
const handleSendMessage = async (content: string) => {
  // 替换为真实的 GraphQL 调用
  const result = await sendMessage({
    variables: { content: content.trim() }
  });
  
  // 处理 AI 回复
  const aiMessage: Message = {
    id: result.data.sendMessage.id,
    content: result.data.sendMessage.content,
    sender: 'ai',
    timestamp: new Date(result.data.sendMessage.timestamp),
  };
  
  setMessages(prev => [...prev, aiMessage]);
};
```

### 样式自定义

所有 iOS 风格样式都在 `src/App.css` 中定义，可以根据需要进行调整：

- 颜色主题
- 气泡样式
- 动画效果
- 响应式断点

## 部署

### Netlify

1. 构建项目：`npm run build`
2. 将 `build` 文件夹上传到 Netlify

### Vercel

1. 连接 GitHub 仓库
2. Vercel 会自动检测 React 应用并进行部署

### 传统服务器

1. 构建项目：`npm run build`
2. 将 `build` 文件夹内容上传到 web 服务器

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题，请提交 GitHub Issue 或联系开发者。
