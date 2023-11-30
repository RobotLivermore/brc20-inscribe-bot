import { useCallback, useState } from "react";

function useLocalStorage<T = any>(key: string, initialValue: T) {
  // 使用 useState 来获取 localStorage 中的值，如果不存在则使用 initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return initialValue;
    }
  });

  // 封装一个函数来更新 localStorage 和本地 state
  const setValue = useCallback((value: T) => {
    try {
      // 更新本地 state
      setStoredValue(value);
      // 更新 localStorage
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  }, [key]);

  return [storedValue, setValue] as [T, (value: T) => void];
}

export default useLocalStorage;
