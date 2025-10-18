// app/frontendUtils/errorHelper.ts
export type ConvexErrorCode =
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "FORBIDDEN";

export const ERROR_TITLES: Record<string, string> = {
  UNAUTHORIZED: "Please sign in",
  FORBIDDEN: "You don\u2019t have access",
  NOT_FOUND: "Not found",
  INTERNAL_ERROR: "Something went wrong",
};

export const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Your session may have expired.",
  FORBIDDEN: "You don't have permission to view this.",
  NOT_FOUND: "We couldn't find what you're looking for.",
  VALIDATION_FAILED: "Please review the form and try again.",
  CONFLICT: "That action conflicts with the current state.",
  RATE_LIMITED: "You're doing that too quickly. Please try again shortly.",
  INTERNAL_ERROR: "Something went wrong. Please try again.",
};

export type ConvexClientError = Error & {
  digest?: string;
  data?: { code?: string; message?: string; details?: unknown };
};

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

export interface ServerErrorData {
  code?: string;
  message?: string;
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
  const title = ERROR_TITLES[code];
  const message = ERROR_MESSAGES[code];
  return { code, title, message };
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
    case "NOT_IMPLEMENTED":
      return { kind: "link", href: "/", label: "Go home" };
    case "RATE_LIMITED":
    case "INTERNAL_ERROR":
    default:
      return { kind: "retry" };
  }
}

export function getConvexErrorMessage(unknownError: unknown): {
  message: string;
  code?: ConvexErrorCode;
  recognized: boolean;
} {
  const payload = (unknownError as ConvexClientError)?.data;
  const code = payload?.code as ConvexErrorCode | undefined;
  const message = payload?.message;
  const fallbackMessage = ERROR_MESSAGES.INTERNAL_ERROR;
  const isRecognized =
    code === "CONFLICT" ||
    code === "UNAUTHORIZED" ||
    code === "NOT_FOUND" ||
    code === "FORBIDDEN" ||
    code === "BAD_REQUEST";
  if (isRecognized) {
    return { message: message ?? fallbackMessage, code, recognized: true };
  }
  return { message: fallbackMessage, recognized: false };
}

export function setErrorFromConvexError(
  unknownError: unknown,
  setError: (msg: string) => void
): void {
  const { message } = getConvexErrorMessage(unknownError);
  console.error(message, unknownError);
  setError(message);
}
