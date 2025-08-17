import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";

interface UseActiveInvitationsResult {
  invitations: Doc<"invitations">[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useActiveInvitations = (
  companyId: Id<"companies"> | null
): UseActiveInvitationsResult => {
  const response = useQuery(
    api.invitations.getActiveInvitationsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;
  const invitations =
    response?.status === ResponseStatus.SUCCESS
      ? (response.data.invitations ?? [])
      : [];

  return {
    invitations,
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to load active invitations.")
      : null,
  };
};
