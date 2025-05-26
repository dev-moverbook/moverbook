import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { ItemSchema } from "@/types/convex-schemas";

interface UseCompanyItemsResult {
  items: ItemSchema[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useCompanyItems = (
  companyId: Id<"companies"> | null
): UseCompanyItemsResult => {
  const response = useQuery<typeof api.items.getItemsByCompany>(
    api.items.getItemsByCompany,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    items:
      response?.status === ResponseStatus.SUCCESS ? response.data.items : [],
    isLoading,
    isError,
    errorMessage: isError ? (response?.error ?? "Failed to load items.") : null,
  };
};
