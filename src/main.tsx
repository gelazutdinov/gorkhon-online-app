import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client';
import App from './App'
import './index.css'
import { apolloClient } from './lib/apollo';
import { 
  disableConsoleInProduction, 
  checkIntegrity, 
  generateCSRFToken,
  logSecurityEvent 
} from './utils/security';

disableConsoleInProduction();

if (!checkIntegrity()) {
  logSecurityEvent('INTEGRITY_CHECK_FAILED');
}

const csrfToken = generateCSRFToken();
sessionStorage.setItem('csrf_token', csrfToken);

window.addEventListener('beforeunload', () => {
  const sensitiveKeys = ['chat_messages', 'temp_data'];
  sensitiveKeys.forEach(key => sessionStorage.removeItem(key));
});

document.addEventListener('contextmenu', (e) => {
  if (import.meta.env.PROD) {
    e.preventDefault();
  }
});

document.addEventListener('keydown', (e) => {
  if (import.meta.env.PROD) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
    }
  }
});

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