import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { ScriptSchema } from "@/types/convex-schemas";

interface UseScriptsByCompanyIdResult {
  scripts: ScriptSchema[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useScriptsByCompanyId = (
  companyId: Id<"companies"> | null
): UseScriptsByCompanyIdResult => {
  const response = useQuery<typeof api.scripts.getScriptsByCompanyId>(
    api.scripts.getScriptsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    scripts:
      response?.status === ResponseStatus.SUCCESS ? response.data.scripts : [],
    isLoading,
    isError,
    errorMessage: isError
      ? (response.error ?? "Failed to load scripts.")
      : null,
  };
};
