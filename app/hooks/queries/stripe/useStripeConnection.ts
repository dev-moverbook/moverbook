"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { Doc } from "@/convex/_generated/dataModel";

type UseStripeConnectionLoading = { status: QueryStatus.LOADING };
type UseStripeConnectionError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseStripeConnectionSuccess = {
  status: QueryStatus.SUCCESS;
  connectedAccount: Doc<"connectedAccounts"> | null;
};

export type UseStripeConnectionResult =
  | UseStripeConnectionLoading
  | UseStripeConnectionError
  | UseStripeConnectionSuccess;

export const useStripeConnection = (): UseStripeConnectionResult => {
  const response = useQuery(api.connectedAccount.getStripeConnection);

  if (!response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load Stripe connection.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    connectedAccount: response.data.stripeConnected,
  };
};
