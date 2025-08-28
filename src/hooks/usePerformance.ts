import { useCallback, useRef, useMemo, useState, useEffect } from 'react';

export const useThrottledCallback = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: T) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - (now - lastCallRef.current));
    }
  }, [callback, delay]);
};

export const useDebounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: T) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

export const useMemoCompare = <T>(
  next: T,
  compare: (previous: T | undefined, next: T) => boolean
) => {
  const previousRef = useRef<T>();
  const previous = previousRef.current;

  const isEqual = compare(previous, next);

  return useMemo(() => {
    if (!isEqual) {
      previousRef.current = next;
      return next;
    }
    return previous as T;
  }, [isEqual, next, previous]);
};

export const useStateWithCallback = <T>(
  initialState: T
): [T, (newState: T, callback?: (state: T) => void) => void] => {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef<((state: T) => void) | undefined>();

  const setStateWithCallback = useCallback((newState: T, callback?: (state: T) => void) => {
    callbackRef.current = callback;
    setState(newState);
  }, []);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = undefined;
    }
  }, [state]);

  return [state, setStateWithCallback];
};