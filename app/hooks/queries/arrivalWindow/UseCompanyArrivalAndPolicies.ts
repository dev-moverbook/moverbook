import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseCompanyArrivalAndPoliciesLoading = { status: QueryStatus.LOADING };
type UseCompanyArrivalAndPoliciesError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseCompanyArrivalAndPoliciesSuccess = {
  status: QueryStatus.SUCCESS;
  data: {
    arrivalWindow: Doc<"arrivalWindow">;
    policy: Doc<"policies">;
  };
};

export type UseCompanyArrivalAndPoliciesResult =
  | UseCompanyArrivalAndPoliciesLoading
  | UseCompanyArrivalAndPoliciesError
  | UseCompanyArrivalAndPoliciesSuccess;

export const useCompanyArrivalAndPolicies = (
  companyId: Id<"companies"> | null
): UseCompanyArrivalAndPoliciesResult => {
  const queryResult = useQuery(
    api.arrivalWindow.getCompanyArrivalAndPolicies,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !queryResult) {
    return { status: QueryStatus.LOADING };
  }

  if (queryResult.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage:
        queryResult.error ??
        "Failed to load company arrival windows and policies.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: {
      arrivalWindow: queryResult.data.arrivalWindow,
      policy: queryResult.data.policy,
    },
  };
};
