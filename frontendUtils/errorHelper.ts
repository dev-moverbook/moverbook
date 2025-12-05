export function getConvexErrorMessage(unknownError: unknown): {
  message: string;
  code?: string;
  recognized: boolean;
} {
  const payload = (
    unknownError as {
      data?: { code?: string; message?: string; showToUser?: boolean };
    }
  )?.data;

  if (payload && typeof payload === "object") {
    const rawCode = payload.code as string | undefined;
    const message = payload.message as string | undefined;
    const showToUser = payload.showToUser ?? false;

    if (showToUser) {
      return {
        message: message ?? "Something went wrong.",
        code: rawCode,
        recognized: true,
      };
    } else {
      return {
        message: "Something went wrong. Please try again.",
        recognized: true,
      };
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
