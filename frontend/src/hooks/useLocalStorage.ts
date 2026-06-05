import { useCallback, useState } from 'react';

type SetLocalStorageValue<T> = T | ((val: T) => T);

type UseLocalStorageReturn<T> = [
  value: T,
  setValue: (value: SetLocalStorageValue<T>) => void,
  removeValue: () => void,
];

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      if (item === null) {
        return initialValue;
      }

      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: SetLocalStorageValue<T>) => {
      setStoredValue((currentValue) => {
        const valueToStore =
          value instanceof Function ? value(currentValue) : value;

        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch {
          // Ignore storage access errors and still update React state.
        }

        return valueToStore;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage access errors and still reset React state.
    }

    setStoredValue(initialValue);
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue];
}
