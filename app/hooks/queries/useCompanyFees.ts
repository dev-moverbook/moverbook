import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { SelectOption } from "@/types/types";
import { GetFeesData } from "@/types/convex-responses";

interface UseCompanyFeesResult {
  data?: GetFeesData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  options: SelectOption[];
}

export const useCompanyFees = (
  companyId: Id<"companies"> | null
): UseCompanyFeesResult => {
  const response = useQuery<typeof api.fees.getFees>(
    api.fees.getFees,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;
  const data = response?.data;
  const options =
    response?.status === ResponseStatus.SUCCESS
      ? response.data.fees.map((fee) => ({
          label: fee.name,
          value: fee.name,
        }))
      : [];

  return {
    options,
    data,
    isLoading,
    isError,
    errorMessage: isError ? (response?.error ?? "Failed to load fees.") : null,
  };
};
