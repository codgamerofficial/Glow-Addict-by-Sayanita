type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  onRetry?: (error: Error, attempt: number) => void;
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 10000,
    jitter = true,
    onRetry,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        const delay = Math.min(
          baseDelayMs * Math.pow(2, attempt - 1),
          maxDelayMs
        );
        const finalDelay = jitter ? delay * (0.5 + Math.random() * 0.5) : delay;

        onRetry?.(lastError, attempt);
        await new Promise((resolve) => setTimeout(resolve, finalDelay));
      }
    }
  }

  throw lastError;
}