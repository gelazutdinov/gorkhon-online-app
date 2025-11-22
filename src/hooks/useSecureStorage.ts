import { useState, useEffect } from 'react';
import { encryptData, decryptData, logSecurityEvent, validateDataIntegrity } from '@/utils/security';

const STORAGE_PASSWORD = 'gorkhon-secure-storage-2024';

export const useSecureStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;
      
      const decrypted = decryptData(item, STORAGE_PASSWORD);
      if (!decrypted) return initialValue;
      
      const parsed = JSON.parse(decrypted);
      if (!validateDataIntegrity(parsed)) {
        logSecurityEvent('DATA_INTEGRITY_VIOLATION', { key });
        return initialValue;
      }
      
      return parsed;
    } catch (error) {
      logSecurityEvent('SECURE_STORAGE_READ_ERROR', { key, error });
      return initialValue;
    }
  });

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      if (!validateDataIntegrity(valueToStore)) {
        logSecurityEvent('INVALID_DATA_BLOCKED', { key });
        return;
      }
      
      setStoredValue(valueToStore);
      
      const serialized = JSON.stringify(valueToStore);
      const encrypted = await encryptData(serialized, STORAGE_PASSWORD);
      
      if (encrypted) {
        localStorage.setItem(key, encrypted);
      }
    } catch (error) {
      logSecurityEvent('SECURE_STORAGE_WRITE_ERROR', { key, error });
    }
  };

  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
      logSecurityEvent('SECURE_STORAGE_REMOVED', { key });
    } catch (error) {
      logSecurityEvent('SECURE_STORAGE_REMOVE_ERROR', { key, error });
    }
  };

  return [storedValue, setValue, removeValue] as const;
};

export const useSessionTimeout = (timeoutMs: number = 1800000) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logSecurityEvent('SESSION_TIMEOUT');
        sessionStorage.clear();
        window.location.reload();
      }, timeoutMs);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeoutMs]);
};
