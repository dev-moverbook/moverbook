import { ConvexError } from "convex/values";

interface ConvexErrorOptions {
  code?: string;
  showToUser?: boolean;
}

interface ConvexErrorPayload {
  data: ConvexErrorOptions;
}

function hasConvexErrorPayload(error: unknown): error is ConvexErrorPayload {
  return error instanceof ConvexError;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};

export function throwConvexError(
  error: unknown,
  options: ConvexErrorOptions = {}
): never {
  console.error("[ConvexError]", error);

  const defaultCode = options.code ?? "INTERNAL_ERROR";
  const defaultShowToUser = options.showToUser ?? false;

  if (hasConvexErrorPayload(error)) {
    const { code = defaultCode, showToUser = defaultShowToUser } = error.data;
    throw new ConvexError({
      ...error.data,
      code,
      showToUser,
    });
  }

  const message = getErrorMessage(error);

  throw new ConvexError({
    code: defaultCode,
    message,
    showToUser: defaultShowToUser,
  });
}
