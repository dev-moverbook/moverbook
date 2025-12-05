export const ERROR_CODES = [
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "VALIDATION_FAILED",
  "CONFLICT",
  "RATE_LIMITED",
  "INTERNAL_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type ConvexErrorCode =
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "BAD_REQUEST";

export interface ServerErrorData {
  code?: string; // may be anything; we coerce it
  message?: string;
  showToUser?: boolean;
}
export interface RouteError extends Error {
  digest?: string;
  data?: ServerErrorData;
}

function coerceCode(maybeCode?: string): ErrorCode {
  switch (maybeCode) {
    case "UNAUTHORIZED":
    case "FORBIDDEN":
    case "NOT_FOUND":
    case "VALIDATION_FAILED":
    case "CONFLICT":
    case "RATE_LIMITED":
    case "INTERNAL_ERROR":
      return maybeCode;
    default:
      return "INTERNAL_ERROR";
  }
}

export function toUiError(routeError: RouteError) {
  const code = coerceCode(routeError.data?.code);
  const message = routeError.data?.message;
  const showToUser = routeError.data?.showToUser ?? false;
  return { code, message, showToUser };
}

export type PrimaryCta =
  | { kind: "retry" }
  | { kind: "link"; href: string; label: string };

export function pickPrimaryCta(code?: ErrorCode | string): PrimaryCta {
  switch (code) {
    case "UNAUTHORIZED":
      return { kind: "link", href: "/sign-in", label: "Sign in" };
    case "FORBIDDEN":
    case "NOT_FOUND":
      return { kind: "link", href: "/", label: "Go home" };
    case "VALIDATION_FAILED":
    case "CONFLICT":
    case "RATE_LIMITED":
    case "INTERNAL_ERROR":
    default:
      return { kind: "retry" };
  }
}

function isRouteError(error: unknown): error is RouteError {
  return typeof error === "object" && error !== null && "data" in error;
}

export function getConvexErrorMessage(unknownError: unknown): {
  message: string;
  code?: ConvexErrorCode;
  recognized: boolean;
} {
  if (isRouteError(unknownError)) {
    const payload = unknownError.data;

    if (payload && typeof payload === "object") {
      const rawCode = payload.code;
      const message = payload.message;
      const showToUser = payload.showToUser ?? false;
      if (showToUser) {
        return {
          message: message ?? "Something went wrong.",
          code: rawCode as ConvexErrorCode | undefined,
          recognized: true,
        };
      } else {
        return {
          message: "Something went wrong. Please try again.",
          recognized: true,
        };
      }
    }
  }
  return {
    message: "Something went wrong. Please try again.",
    recognized: false,
  };
}

export function setErrorFromConvexError(
  unknownError: unknown,
  setError: (msg: string) => void
): void {
  const { message } = getConvexErrorMessage(unknownError);
  console.error(message, unknownError);
  setError(message);
}
