import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { MoveSchema } from "@/types/convex-schemas";

interface UseMovesByNameResult {
  data?: MoveSchema[] | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useMovesByName = (
  companyId: Id<"companies"> | null,
  name: string
): UseMovesByNameResult => {
  const shouldFetch = companyId && name.trim().length > 0;

  const response = useQuery<typeof api.move.getMovesByName>(
    api.move.getMovesByName,
    shouldFetch ? { companyId, name } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;
  const data =
    response?.status === ResponseStatus.SUCCESS ? response.data.moves : null;

  return {
    data,
    isLoading,
    isError,
    errorMessage: isError ? (response?.error ?? "Failed to load moves.") : null,
  };
};
