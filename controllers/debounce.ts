import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, ms: number = 0) => {
  const [state, setState] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(setState, ms, value);
    return () => clearTimeout(timeoutId);
  }, [value, ms]);

  return state;
};
