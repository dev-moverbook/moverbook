import { useQuery } from "convex/react";
import { ResponseStatus } from "@/types/enums";
import { api } from "@/convex/_generated/api";
import { GetMoveOptionsData } from "@/types/convex-responses";
import { useSlugContext } from "@/app/contexts/SlugContext";

interface UseMoveOptionsResult {
  data: GetMoveOptionsData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useMoveOptions = (): UseMoveOptionsResult => {
  const { companyId } = useSlugContext();

  const response = useQuery<typeof api.move.getMoveOptions>(
    api.move.getMoveOptions,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    data: response?.status === ResponseStatus.SUCCESS ? response.data : null,
    isLoading,
    isError,
    errorMessage: isError
      ? (response.error ?? "Failed to load move options.")
      : null,
  };
};
