/**
 * throttle — limits how often a function can fire.
 *
 * Usage:
 *   const handleScroll = throttle(() => { ... }, 200);
 *   window.addEventListener('scroll', handleScroll);
 *
 * @param fn     The function to throttle
 * @param delay  Minimum ms between calls (default: 200ms)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 200
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastCall = now;
      fn(...args);
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

export default throttle;
