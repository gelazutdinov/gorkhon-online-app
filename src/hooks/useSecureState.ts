import { useState, useEffect } from 'react';
import { encryptLocalStorage, decryptLocalStorage } from '@/utils/security';

export function useSecureLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = decryptLocalStorage(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      encryptLocalStorage(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to secure storage:', error);
    }
  };

  return [storedValue, setValue];
}

export function useSecureSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(atob(item)) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      const encoded = btoa(JSON.stringify(value));
      sessionStorage.setItem(key, encoded);
    } catch (error) {
      console.error('Error writing to session storage:', error);
    }
  };

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(key);
    };
  }, [key]);

  return [storedValue, setValue];
}
