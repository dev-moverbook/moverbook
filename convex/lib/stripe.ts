import { serverEnv } from "../backendUtils/serverEnv";
import { Stripe } from "stripe";

const { STRIPE_KEY } = serverEnv();

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: "2025-02-24.acacia",
});
