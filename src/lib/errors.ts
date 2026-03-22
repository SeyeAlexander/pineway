/**
 * Standardized error handling for server actions
 *
 * This module provides a consistent error structure across all server actions
 * to avoid Next.js production build error obfuscation while maintaining
 * Sentry integration and developer-friendly error messages.
 */

/**
 * Error codes for categorizing different types of errors
 */
export enum ErrorCode {
  /** User is not authenticated */
  UNAUTHORIZED = "UNAUTHORIZED",
  /** User lacks permission for the requested action */
  FORBIDDEN = "FORBIDDEN",
  /** Requested resource does not exist */
  NOT_FOUND = "NOT_FOUND",
  /** Input validation failed (includes Zod validation errors) */
  VALIDATION_ERROR = "VALIDATION_ERROR",
  /** Database operation failed */
  DATABASE_ERROR = "DATABASE_ERROR",
  /** External API call failed (Stripe, Resend, Notion, etc.) */
  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",
  /** Business logic constraint violated */
  BUSINESS_LOGIC_ERROR = "BUSINESS_LOGIC_ERROR",
}

/**
 * Validation error with field path for form field highlighting
 */
export interface ValidationError {
  /** Path to the field that failed validation (e.g., ['email'] or ['address', 'street']) */
  path: (string | number)[];
  /** Human-readable validation error message */
  message: string;
}

/**
 * Standardized error object returned by server actions
 */
export interface AppError {
  /** Error category for programmatic handling */
  code: ErrorCode;
  /** Internal error message for logging/debugging */
  message: string;
  /** User-friendly error message safe to display in UI */
  userMessage: string;
  /** Validation errors for form field highlighting (only present when code is VALIDATION_ERROR) */
  validationErrors?: ValidationError[];
  /** Original error object for Sentry reporting */
  originalError?: unknown;
  /** Additional context-specific metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Create an AppError with common defaults
 */
export function createError(params: {
  code: ErrorCode;
  message: string;
  userMessage?: string;
  validationErrors?: ValidationError[];
  originalError?: unknown;
  metadata?: Record<string, unknown>;
}): AppError {
  return {
    code: params.code,
    message: params.message,
    userMessage: params.userMessage ?? params.message,
    validationErrors: params.validationErrors,
    originalError: params.originalError,
    metadata: params.metadata,
  };
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "userMessage" in error
  );
}
