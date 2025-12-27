import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client';
import App from './App'
import './index.css'
import { apolloClient } from './lib/apollo';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('✅ Service Worker зарегистрирован:', registration.scope);
        }
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                if (import.meta.env.DEV) {
                  console.log('🔄 Доступно обновление приложения');
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.log('❌ Service Worker не зарегистрирован:', error);
        }
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);