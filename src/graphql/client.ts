import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL API endpoint - 替换为您的实际GraphQL服务器地址
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:4000/graphql',
});

// 认证链接 - 如果需要添加认证头
const authLink = setContext((_, { headers }) => {
  // 从localStorage获取认证token
  const token = localStorage.getItem('auth-token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
    }
  }
});

// Apollo Client实例
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
