/**
 * Debounce Utility
 *
 * Prevents rapid successive calls to a function by delaying execution
 * until a specified time has passed since the last call.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

type DebouncedAsyncFunction<T extends AnyFunction> = {
  (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>>;
  cancel: () => void;
};

/**
 * Creates a debounced version of an async function
 * Returns a promise that resolves with the result of the last call
 */
export function debounceAsync<T extends AnyFunction>(
  fn: T,
  delay: number
): DebouncedAsyncFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingResolve: ((value: Awaited<ReturnType<T>>) => void) | null = null;
  let pendingReject: ((reason: unknown) => void) | null = null;

  const debouncedFn = ((...args: Parameters<T>) => {
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Store the latest resolve/reject
      pendingResolve = resolve;
      pendingReject = reject;

      // Set new timeout
      timeoutId = setTimeout(async () => {
        timeoutId = null;
        try {
          const result = await fn(...args);
          if (pendingResolve) {
            pendingResolve(result);
          }
        } catch (error) {
          if (pendingReject) {
            pendingReject(error);
          }
        }
        pendingResolve = null;
        pendingReject = null;
      }, delay);
    });
  }) as DebouncedAsyncFunction<T>;

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    pendingResolve = null;
    pendingReject = null;
  };

  return debouncedFn;
}

/**
 * Simple trailing edge debounce for void functions
 * Collapses multiple rapid calls into a single execution after delay
 */
export function debounce<T extends AnyFunction>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, delay);
  }) as T & { cancel: () => void };

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn;
}

/**
 * Throttle that ensures function runs at most once per interval
 * Immediate execution on first call, then throttled
 */
export function throttle<T extends AnyFunction>(
  fn: T,
  interval: number
): T & { cancel: () => void } {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttledFn = ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= interval) {
      // Execute immediately
      lastCall = now;
      fn(...args);
    } else {
      // Schedule for later if not already scheduled
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          timeoutId = null;
          fn(...args);
        }, interval - timeSinceLastCall);
      }
    }
  }) as T & { cancel: () => void };

  throttledFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttledFn;
}
