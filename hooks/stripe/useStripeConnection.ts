"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export const useStripeConnection = ():
  | Doc<"connectedAccounts">
  | null
  | undefined => {
  const response = useQuery(api.connectedAccount.getStripeConnection);

  return response ?? null;
};
