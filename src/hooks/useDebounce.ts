import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until the user stops changing it.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchQuery, 500);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 *
 * @param value  The value to debounce (string, number, etc.)
 * @param delay  Milliseconds to wait after last change (default: 500ms)
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
