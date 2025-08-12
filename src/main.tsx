import * as React from 'react';
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client';
import App from './App'
import './index.css'
import { apolloClient } from './lib/apollo';

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);