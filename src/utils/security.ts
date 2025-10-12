export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const sanitizeHTML = (html: string): string => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
};

export const encryptLocalStorage = (key: string, value: string): void => {
  try {
    const encrypted = btoa(encodeURIComponent(value));
    localStorage.setItem(key, encrypted);
  } catch (e) {
    console.error('Failed to encrypt data');
  }
};

export const decryptLocalStorage = (key: string): string | null => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decodeURIComponent(atob(encrypted));
  } catch (e) {
    console.error('Failed to decrypt data');
    return null;
  }
};

export const preventXSS = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return token === storedToken;
};

export const secureSessionStorage = {
  setItem: (key: string, value: string) => {
    const timestamp = Date.now();
    const data = JSON.stringify({ value, timestamp });
    sessionStorage.setItem(key, btoa(data));
  },
  
  getItem: (key: string, maxAge: number = 3600000): string | null => {
    const encoded = sessionStorage.getItem(key);
    if (!encoded) return null;
    
    try {
      const decoded = atob(encoded);
      const { value, timestamp } = JSON.parse(decoded);
      
      if (Date.now() - timestamp > maxAge) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return value;
    } catch (e) {
      return null;
    }
  },
  
  removeItem: (key: string) => {
    sessionStorage.removeItem(key);
  }
};

export const detectSuspiciousActivity = (): boolean => {
  const attempts = parseInt(sessionStorage.getItem('failed_attempts') || '0');
  return attempts > 5;
};

export const logSecurityEvent = (event: string, details?: any) => {
  const timestamp = new Date().toISOString();
  console.warn(`[SECURITY] ${timestamp} - ${event}`, details || '');
};

export const clearSensitiveData = () => {
  const keysToKeep = ['theme', 'splashShown'];
  
  Object.keys(localStorage).forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage).forEach(key => {
    if (!keysToKeep.includes(key)) {
      sessionStorage.removeItem(key);
    }
  });
};

export const disableConsoleInProduction = () => {
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
  }
};

export const checkIntegrity = (): boolean => {
  const criticalElements = ['root'];
  return criticalElements.every(id => document.getElementById(id) !== null);
};
