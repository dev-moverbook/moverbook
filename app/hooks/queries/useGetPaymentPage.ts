// app/hooks/queries/payments/useGetPaymentPage.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { GetPaymentPageData } from "@/types/convex-responses";

type UseGetPaymentPageLoading = { status: QueryStatus.LOADING };
type UseGetPaymentPageError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseGetPaymentPageSuccess = {
  status: QueryStatus.SUCCESS;
  data: GetPaymentPageData;
};

export type UseGetPaymentPageResult =
  | UseGetPaymentPageLoading
  | UseGetPaymentPageError
  | UseGetPaymentPageSuccess;

export const useGetPaymentPage = (
  moveId: Id<"move">
): UseGetPaymentPageResult => {
  const response = useQuery<typeof api.paymentStep.getPaymentPage>(
    api.paymentStep.getPaymentPage,
    { moveId }
  );

  if (!response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load payment page data.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: response.data,
  };
};
