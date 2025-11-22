import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client';
import App from './App'
import './index.css'
import { apolloClient } from './lib/apollo';
import { 
  disableConsoleInProduction, 
  checkIntegrity, 
  generateCSRFToken,
  logSecurityEvent,
  preventScreenCapture,
  detectDevTools,
  sanitizeClipboard,
  clearSensitiveData
} from './utils/security';

disableConsoleInProduction();
preventScreenCapture();
detectDevTools();
sanitizeClipboard();

if (!checkIntegrity()) {
  logSecurityEvent('INTEGRITY_CHECK_FAILED');
}

const csrfToken = generateCSRFToken();
sessionStorage.setItem('csrf_token', csrfToken);

window.addEventListener('beforeunload', () => {
  clearSensitiveData();
});

window.addEventListener('blur', () => {
  if (import.meta.env.PROD) {
    const sensitiveKeys = ['chat_messages', 'temp_data', 'admin_authenticated'];
    sensitiveKeys.forEach(key => sessionStorage.removeItem(key));
  }
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