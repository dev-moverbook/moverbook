import { useQuery } from "convex/react";
import { ResponseStatus } from "@/types/enums";
import { api } from "@/convex/_generated/api";
import { GetMoveAssignmentsPageData } from "@/types/convex-responses";
import { Id } from "@/convex/_generated/dataModel";

interface UseGetMoveAssignmentsPageResult {
  data: GetMoveAssignmentsPageData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useGetMoveAssignmentsPage = (
  moveId: Id<"move">
): UseGetMoveAssignmentsPageResult => {
  const response = useQuery<typeof api.moveAssignments.getMoveAssignmentsPage>(
    api.moveAssignments.getMoveAssignmentsPage,
    { moveId }
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    data: response?.status === ResponseStatus.SUCCESS ? response.data : null,
    isLoading,
    isError,
    errorMessage: isError
      ? (response.error ?? "Failed to load move assignments.")
      : null,
  };
};
