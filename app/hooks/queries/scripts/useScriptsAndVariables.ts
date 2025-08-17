import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseScriptsAndVariablesLoading = { status: QueryStatus.LOADING };
type UseScriptsAndVariablesError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseScriptsAndVariablesSuccess = {
  status: QueryStatus.SUCCESS;
  scripts: Doc<"scripts">[];
  variables: Doc<"variables">[];
};

export type UseScriptsAndVariablesResult =
  | UseScriptsAndVariablesLoading
  | UseScriptsAndVariablesError
  | UseScriptsAndVariablesSuccess;

export const useScriptsAndVariables = (
  companyId: Id<"companies"> | null
): UseScriptsAndVariablesResult => {
  const response = useQuery(
    api.scripts.getActiveScriptsAndVariablesByCompanyId,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage:
        response.error ?? "Failed to load company scripts and variables.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    scripts: response.data.scripts,
    variables: response.data.variables,
  };
};
