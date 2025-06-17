import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { UserSchema } from "@/types/convex-schemas";
import { api } from "@/convex/_generated/api";

interface UseGetSalesRepsResult {
  users: UserSchema[] | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useGetSalesReps = (
  companyId: Id<"companies"> | null
): UseGetSalesRepsResult => {
  const response = useQuery<typeof api.users.getSalesRepsByCompanyId>(
    api.users.getSalesRepsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    users:
      response?.status === ResponseStatus.SUCCESS ? response.data.users : null,
    isLoading,
    isError,
    errorMessage: isError
      ? (response.error ?? "Failed to load sales reps.")
      : null,
  };
};
