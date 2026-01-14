export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = 'INTERNAL_ERROR',
    public status: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleActionError(error: any) {
  console.error(`[ACTION_ERROR] ${error.name}: ${error.message}`, {
    stack: error.stack,
    code: error.code
  });

  if (error instanceof AppError) {
    return { success: false, error: error.message, code: error.code };
  }

  // Generic production error message
  return { 
    success: false, 
    error: 'An unexpected error occurred. Please try again later.',
    code: 'UNKNOWN_ERROR'
  };
}

export function standardizeResponse<T>(data: T) {
  return { success: true, data };
}
