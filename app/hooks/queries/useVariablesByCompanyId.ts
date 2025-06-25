import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { VariableSchema } from "@/types/convex-schemas";

interface UseVariablesByCompanyIdResult {
  variables: VariableSchema[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useVariablesByCompanyId = (
  companyId: Id<"companies"> | null
): UseVariablesByCompanyIdResult => {
  const response = useQuery<typeof api.variables.getVariablesByCompanyId>(
    api.variables.getVariablesByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    variables:
      response?.status === ResponseStatus.SUCCESS
        ? response.data.variables
        : [],
    isLoading,
    isError,
    errorMessage: isError
      ? (response.error ?? "Failed to load variables.")
      : null,
  };
};
