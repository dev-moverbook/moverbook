import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { PolicySchema } from "@/types/convex-schemas";

interface UseCompanyPolicyResult {
  policy: PolicySchema | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useCompanyPolicy = (
  companyId: Id<"companies"> | null
): UseCompanyPolicyResult => {
  const response = useQuery<typeof api.policies.getPolicy>(
    api.policies.getPolicy,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    policy:
      response?.status === ResponseStatus.SUCCESS ? response.data.policy : null,
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to load policy.")
      : null,
  };
};
