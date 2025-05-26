import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { ItemSchema, CategorySchema, RoomSchema } from "@/types/convex-schemas";

interface UseCompanyInventoryDataResult {
  data: {
    items: ItemSchema[];
    categories: CategorySchema[];
    rooms: RoomSchema[];
  };
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useCompanyInventoryData = (
  companyId: Id<"companies"> | null
): UseCompanyInventoryDataResult => {
  const response = useQuery<
    typeof api.items.getItemsAndCategoriesAndRoomsByCompany
  >(
    api.items.getItemsAndCategoriesAndRoomsByCompany,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  const data =
    response?.status === ResponseStatus.SUCCESS
      ? {
          items: response.data.items,
          categories: response.data.categories,
          rooms: response.data.rooms,
        }
      : {
          items: [],
          categories: [],
          rooms: [],
        };

  return {
    data,
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to load inventory data.")
      : null,
  };
};
