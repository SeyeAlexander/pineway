import { ErrorCode } from "@/lib/errors";
import { failure } from "@/lib/result";
import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

/**
 * A wrapper around zValidator that enforces standardized error handling.
 *
 * If validation fails, it returns a formatted Result object with VALIDATION_ERROR.
 */
export const validate = <T extends keyof ValidationTargets, S extends ZodType>(
  target: T,
  schema: S,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        failure({
          code: ErrorCode.VALIDATION_ERROR,
          message: "Validation failed",
          userMessage: "Please check your input.",
          validationErrors: result.error.issues.map((e) => ({
            path: e.path as (string | number)[],
            message: e.message,
          })),
        }),
        400,
      );
    }
  });
