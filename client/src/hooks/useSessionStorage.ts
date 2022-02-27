import { useState, useEffect } from "react";

function getSessionStorageOrDefault(defaultValue: any, key: string) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}

export function useSessionStorage(defaultValue: any, key: string) {
  const [value, setValue] = useState(
    getSessionStorageOrDefault(defaultValue, key)
  );

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
