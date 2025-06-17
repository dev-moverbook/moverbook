import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { GetCompanyContactData } from "@/types/convex-responses";

interface UseCompanyContactResult {
  data?: GetCompanyContactData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useCompanyContact = (
  companyId: Id<"companies"> | null
): UseCompanyContactResult => {
  const response = useQuery<typeof api.companyContact.getCompanyContact>(
    api.companyContact.getCompanyContact,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;
  const data = response?.data;

  return {
    data,
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to load company contact.")
      : null,
  };
};
