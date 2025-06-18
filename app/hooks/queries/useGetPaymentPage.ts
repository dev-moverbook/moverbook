import { useQuery } from "convex/react";
import { ResponseStatus } from "@/types/enums";
import { api } from "@/convex/_generated/api";
import { GetPaymentPageData } from "@/types/convex-responses";
import { Id } from "@/convex/_generated/dataModel";

interface UseGetPaymentPageResult {
  data: GetPaymentPageData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useGetPaymentPage = (
  moveId: Id<"move">
): UseGetPaymentPageResult => {
  const response = useQuery<typeof api.paymentStep.getPaymentPage>(
    api.paymentStep.getPaymentPage,
    { moveId }
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    data: response?.status === ResponseStatus.SUCCESS ? response.data : null,
    isLoading,
    isError,
    errorMessage: isError
      ? (response.error ?? "Failed to load payment page data.")
      : null,
  };
};
