// Performance utilities for optimized rendering

export const createEventPool = <T extends Event>(
  size: number = 10
): {
  getEvent: () => T | null;
  returnEvent: (event: T) => void;
  clear: () => void;
} => {
  const pool: T[] = [];
  
  return {
    getEvent: () => pool.pop() || null,
    returnEvent: (event: T) => {
      if (pool.length < size) {
        pool.push(event);
      }
    },
    clear: () => {
      pool.length = 0;
    }
  };
};

export const batchUpdates = (() => {
  const callbacks: (() => void)[] = [];
  let isScheduled = false;

  const flush = () => {
    const toRun = callbacks.splice(0);
    isScheduled = false;
    
    for (const callback of toRun) {
      try {
        callback();
      } catch (error) {
        console.error('Error in batched update:', error);
      }
    }
  };

  return (callback: () => void) => {
    callbacks.push(callback);
    
    if (!isScheduled) {
      isScheduled = true;
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(flush, { timeout: 16 });
      } else {
        setTimeout(flush, 0);
      }
    }
  };
})();

export const createMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  equalityFn: (a: R, b: R) => boolean = (a, b) => a === b
) => {
  let lastInput: T;
  let lastResult: R;
  let hasResult = false;

  return (input: T): R => {
    if (!hasResult || input !== lastInput) {
      const newResult = selector(input);
      
      if (!hasResult || !equalityFn(lastResult, newResult)) {
        lastResult = newResult;
      }
      
      lastInput = input;
      hasResult = true;
    }
    
    return lastResult;
  };
};

export const optimizeScroll = (() => {
  let rafId: number | null = null;
  let isScrolling = false;

  return {
    onScroll: (callback: () => void) => {
      if (!isScrolling) {
        isScrolling = true;
        document.body.style.pointerEvents = 'none';
      }

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        callback();
        
        setTimeout(() => {
          isScrolling = false;
          document.body.style.pointerEvents = 'auto';
          rafId = null;
        }, 150);
      });
    }
  };
})();

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const measurePerformance = (name: string) => {
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      console.log(`${name}: ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};