import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { ArrivalWindowSchema } from "@/types/convex-schemas";

interface UseCompanyArrivalResult {
  arrivalWindow: ArrivalWindowSchema | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useCompanyArrivalResult = (
  companyId: Id<"companies"> | null
): UseCompanyArrivalResult => {
  const response = useQuery<typeof api.arrivalWindow.getCompanyArrival>(
    api.arrivalWindow.getCompanyArrival,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    arrivalWindow:
      response?.status === ResponseStatus.SUCCESS
        ? response.data.arrivalWindow
        : null,
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to load company arrival window.")
      : null,
  };
};
