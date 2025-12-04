import { getMissingEnvKeys } from "@/utils/objects";

export type ClientEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
  NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: string;
  NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: string;
  NEXT_PUBLIC_CONVEX_URL: string;
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
};

export const clientEnv = (): ClientEnv => {
  const env = {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  } as const;

  const missing = getMissingEnvKeys(env);

  if (missing.length > 0) {
    throw Error(`Missing env vars: ${missing.join(", ")}`);
  }

  return env as ClientEnv;
};
