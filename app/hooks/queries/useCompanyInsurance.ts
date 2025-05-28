import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { GetInsurancePoliciesData } from "@/types/convex-responses";

interface UseCompanyInsuranceResult {
  data?: GetInsurancePoliciesData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useCompanyInsurance = (
  companyId: Id<"companies"> | null
): UseCompanyInsuranceResult => {
  const response = useQuery<typeof api.insurancePolicies.getInsurancePolicies>(
    api.insurancePolicies.getInsurancePolicies,
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
      ? (response?.error ?? "Failed to load insurance policies.")
      : null,
  };
};
