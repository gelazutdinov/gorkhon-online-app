import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client';
import App from './App'
import './index.css'
import { apolloClient } from './lib/apollo';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((error) => {
        console.log('SW registration failed: ', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);