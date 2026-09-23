export class ApiError extends Error {
  statusCode: number;
  errors: unknown[];

  constructor(statusCode: number, message: string, errors: unknown[] = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
