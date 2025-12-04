import { STRIPE_API_VERSION } from "@/types/const";
import Stripe from "stripe";
import { serverEnv } from "../backendUtils/serverEnv";

const { STRIPE_KEY } = serverEnv();

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: STRIPE_API_VERSION,
});
