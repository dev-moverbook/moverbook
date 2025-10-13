"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GetPaymentPageData } from "@/types/convex-responses";

export const useGetPaymentPage = (
  moveId: Id<"move">
): GetPaymentPageData | undefined => {
  const response = useQuery<typeof api.paymentStep.getPaymentPage>(
    api.paymentStep.getPaymentPage,
    { moveId }
  );

  return response;
};
