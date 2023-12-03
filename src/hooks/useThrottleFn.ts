// useThrottleFn

import { useCallback, useRef } from "react";
import useLatest from './useLatest'


type noop = (...args: any[]) => any;

  

function useThrottleFn<T extends noop>(fn: T, wait: number) {
  const fnRef = useLatest(fn);


  const lastCallTimeRef = useRef(0);

  const run = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallTimeRef.current > wait) {
      lastCallTimeRef.current = now;
      fnRef.current(...args);
    }
  }, [fnRef, wait])

  return run
}

export default useThrottleFn;
