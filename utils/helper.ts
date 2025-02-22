export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getBaseUrl = (): string => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (appUrl) {
    return appUrl;
  }

  // Use window.location on the client side as a fallback
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Default to localhost for server-side development
  return "http://localhost:3001";
};
