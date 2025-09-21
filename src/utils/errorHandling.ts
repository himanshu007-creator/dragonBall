export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError(error.message);
  }

  return new APIError('An unknown error occurred');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message.includes('fetch');
}

export function shouldRetry(error: unknown): boolean {
  if (error instanceof APIError) {
    // Retry on server errors (5xx) but not client errors (4xx)
    return error.status ? error.status >= 500 : false;
  }

  // Retry on network errors
  return isNetworkError(error);
}
