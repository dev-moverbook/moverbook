import { getMissingEnvKeys } from "@/utils/objects";
import { throwConvexError } from "./errors";
export type ServerEnv = {
  CLERK_SECRET_KEY: string;
  CLERK_WEBHOOK_SECRET: string;
  GOOGLE_ROUTES_API_KEY: string;
  SENDGRID_API_KEY: string;
  SENDGRID_FROM_EMAIL: string;
  STRIPE_CONNECTED_WEBHOOK_SECRET: string;
  STRIPE_CONNECTED_PAYMENTS_WEBHOOK_SECRET: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  VAPID_EMAIL: string;
  VAPID_PRIVATE_KEY: string;
  STRIPE_KEY: string;
  HTTP_ACTIONS: string;
  RELAY_ADDRESS: string;
};

export const serverEnv = (): ServerEnv => {
  const env = {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    GOOGLE_ROUTES_API_KEY: process.env.GOOGLE_ROUTES_API_KEY,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    STRIPE_CONNECTED_WEBHOOK_SECRET:
      process.env.STRIPE_CONNECTED_WEBHOOK_SECRET,
    STRIPE_CONNECTED_PAYMENTS_WEBHOOK_SECRET:
      process.env.STRIPE_CONNECTED_PAYMENTS_WEBHOOK_SECRET,
    STRIPE_KEY: process.env.STRIPE_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    VAPID_EMAIL: process.env.VAPID_EMAIL,
    HTTP_ACTIONS: process.env.HTTP_ACTIONS,
    RELAY_ADDRESS: process.env.RELAY_ADDRESS,
  } as const;

  const missing = getMissingEnvKeys(env) ;

  if (missing.length > 0) {
    throwConvexError(`Missing env vars: ${missing.join(", ")}`, {
      code: "MISSING_ENV",
    });
  }

  return env as ServerEnv;
};
