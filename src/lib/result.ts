/**
 * Result type for server actions
 *
 * Provides a type-safe way to return either success data or error information
 * from server actions without throwing exceptions.
 */

import type { AppError, ErrorCode, ValidationError } from "./errors";
import { createError } from "./errors";

/**
 * Discriminated union representing either a successful result or an error
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

/**
 * Create a successful result
 */
export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

/**
 * Create a failure result with an AppError
 */
export function failure(error: AppError): Result<never> {
  console.error(error);
  return { success: false, error };
}

/**
 * Capture an error to Sentry and return a failure result
 *
 * Logs to console for the purpose of this challenge.
 */
export function captureAndReturnError(params: {
  code: ErrorCode;
  message: string;
  userMessage?: string;
  validationErrors?: ValidationError[];
  originalError?: unknown;
  metadata?: Record<string, unknown>;
}): Result<never> {
  const error = createError(params);
  console.error(error);

  delete error.originalError;

  return { success: false, error };
}

/**
 * Type guard to check if a Result is a success
 */
export function isSuccess<T>(
  result: Result<T>,
): result is { success: true; data: T } {
  return result.success === true;
}

/**
 * Type guard to check if a Result is a failure
 */
export function isFailure<T>(
  result: Result<T>,
): result is { success: false; error: AppError } {
  return result.success === false;
}
