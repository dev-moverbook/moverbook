import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { SelectOption } from "@/types/types";

interface UseReferralSourcesResult {
  options: SelectOption[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useReferralSources = (
  companyId: Id<"companies"> | null
): UseReferralSourcesResult => {
  const response = useQuery<typeof api.referrals.getActiveReferralsByCompanyId>(
    api.referrals.getActiveReferralsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;
  const options =
    response?.status === ResponseStatus.SUCCESS
      ? response.data.referrals.map((ref) => ({
          label: ref.name,
          value: ref.name,
        }))
      : [];

  return {
    options,
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to load referrals.")
      : null,
  };
};
