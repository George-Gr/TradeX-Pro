interface ErrorResponse {
  code: string;
  message: string;
}

export const isErrorResponse = (error: unknown): error is ErrorResponse => {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isErrorResponse(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
