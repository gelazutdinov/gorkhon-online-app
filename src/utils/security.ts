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

const generateEncryptionKey = async (password: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('gorkhon-online-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptData = async (data: string, password: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const key = await generateEncryptionKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(data)
    );
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (e) {
    logSecurityEvent('ENCRYPTION_FAILED', e);
    return '';
  }
};

export const decryptData = async (encryptedData: string, password: string): Promise<string | null> => {
  try {
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const key = await generateEncryptionKey(password);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (e) {
    logSecurityEvent('DECRYPTION_FAILED', e);
    return null;
  }
};

export const encryptLocalStorage = (key: string, value: string): void => {
  try {
    const encrypted = btoa(encodeURIComponent(value));
    localStorage.setItem(key, encrypted);
  } catch (e) {
    logSecurityEvent('STORAGE_ENCRYPTION_FAILED', e);
  }
};

export const decryptLocalStorage = (key: string): string | null => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decodeURIComponent(atob(encrypted));
  } catch (e) {
    logSecurityEvent('STORAGE_DECRYPTION_FAILED', e);
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
  const sanitizedDetails = details ? obfuscatePersonalData(details) : '';
  
  if (import.meta.env.DEV) {
    console.warn(`[SECURITY] ${timestamp} - ${event}`, sanitizedDetails);
  }
  
  const logs = JSON.parse(sessionStorage.getItem('security_logs') || '[]');
  logs.push({ event, timestamp, details: sanitizedDetails });
  
  if (logs.length > 50) logs.shift();
  
  sessionStorage.setItem('security_logs', JSON.stringify(logs));
};

export const maskPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return '***';
  
  const lastDigits = cleaned.slice(-4);
  const stars = '*'.repeat(Math.min(cleaned.length - 4, 7));
  return `${stars}${lastDigits}`;
};

export const obfuscatePersonalData = (data: any): any => {
  if (typeof data === 'string') {
    if (/^[\d\s\-\+\(\)]+$/.test(data)) {
      return maskPhoneNumber(data);
    }
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => obfuscatePersonalData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const obfuscated: any = {};
    for (const key in data) {
      if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel')) {
        obfuscated[key] = maskPhoneNumber(String(data[key]));
      } else {
        obfuscated[key] = obfuscatePersonalData(data[key]);
      }
    }
    return obfuscated;
  }
  
  return data;
};

export const clearSensitiveData = () => {
  const keysToKeep = ['theme', 'splashShown', 'installPromptShown'];
  
  Object.keys(localStorage).forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage).forEach(key => {
    sessionStorage.removeItem(key);
  });
  
  logSecurityEvent('SENSITIVE_DATA_CLEARED');
};

export const disableConsoleInProduction = () => {
  if (import.meta.env.PROD) {
    const noop = () => {};
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    console.warn = noop;
  }
};

export const preventScreenCapture = () => {
  if (import.meta.env.PROD) {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        logSecurityEvent('SCREENSHOT_ATTEMPT_DETECTED');
      }
    });
  }
};

export const detectDevTools = () => {
  if (import.meta.env.PROD) {
    const threshold = 160;
    const check = () => {
      if (window.outerWidth - window.innerWidth > threshold || 
          window.outerHeight - window.innerHeight > threshold) {
        logSecurityEvent('DEVTOOLS_DETECTED');
        clearSensitiveData();
      }
    };
    
    setInterval(check, 1000);
  }
};

export const sanitizeClipboard = () => {
  document.addEventListener('copy', (e) => {
    const selection = window.getSelection()?.toString() || '';
    if (/[\d\s\-\+\(\)]{7,}/.test(selection)) {
      e.preventDefault();
      logSecurityEvent('PHONE_NUMBER_COPY_PREVENTED');
    }
  });
};

export const checkIntegrity = (): boolean => {
  const criticalElements = ['root'];
  return criticalElements.every(id => document.getElementById(id) !== null);
};

export const rateLimit = (() => {
  const limits = new Map<string, { count: number; resetTime: number }>();
  
  return (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const limit = limits.get(key);
    
    if (!limit || now > limit.resetTime) {
      limits.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (limit.count >= maxAttempts) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { key, attempts: limit.count });
      return false;
    }
    
    limit.count++;
    return true;
  };
})();

export const validateDataIntegrity = (data: any): boolean => {
  try {
    const serialized = JSON.stringify(data);
    if (serialized.includes('<script>') || 
        serialized.includes('javascript:') ||
        serialized.includes('onerror=') ||
        serialized.includes('onclick=')) {
      logSecurityEvent('XSS_ATTEMPT_DETECTED', { data: serialized.substring(0, 100) });
      return false;
    }
    return true;
  } catch {
    return false;
  }
};