const OFFLINE_CACHE_KEY = 'gorkhon_offline_data';

interface CachedData {
  timestamp: number;
  data: any;
}

export const saveOfflineData = (key: string, data: any): void => {
  try {
    const cache = getOfflineCache();
    cache[key] = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to save offline data:', error);
  }
};

export const getOfflineData = (key: string, maxAge: number = 24 * 60 * 60 * 1000): any => {
  try {
    const cache = getOfflineCache();
    const cached = cache[key];
    
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      delete cache[key];
      localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cache));
      return null;
    }
    
    return cached.data;
  } catch (error) {
    console.error('Failed to get offline data:', error);
    return null;
  }
};

const getOfflineCache = (): Record<string, CachedData> => {
  try {
    const stored = localStorage.getItem(OFFLINE_CACHE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const clearOfflineData = (key?: string): void => {
  try {
    if (key) {
      const cache = getOfflineCache();
      delete cache[key];
      localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cache));
    } else {
      localStorage.removeItem(OFFLINE_CACHE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear offline data:', error);
  }
};

export const isOnline = (): boolean => navigator.onLine;
