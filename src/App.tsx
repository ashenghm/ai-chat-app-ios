import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client';
import ChatInterface from './components/ChatInterface';
import './App.css';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <ChatInterface />
      </div>
    </ApolloProvider>
  );
};

export default App;
