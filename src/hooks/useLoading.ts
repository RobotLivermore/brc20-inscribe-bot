import { useCallback, useRef, useState } from 'react';

const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const getIsLoading = useCallback(() => {
    return loadingRef.current;
  }, [])

  const setIsLoading = useCallback((value: boolean) => {
    loadingRef.current = value;
    setLoading(value);
  },[] );

  return [loading, getIsLoading, setIsLoading ] as [boolean, () => boolean, (value: boolean) => void];
}

export default useLoading;