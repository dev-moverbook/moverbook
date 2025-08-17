"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseCompanyInventoryDataLoading = { status: QueryStatus.LOADING };
type UseCompanyInventoryDataError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseCompanyInventoryDataSuccess = {
  status: QueryStatus.SUCCESS;
  data: {
    items: Doc<"items">[];
    categories: Doc<"categories">[];
    rooms: Doc<"rooms">[];
  };
};

export type UseCompanyInventoryDataResult =
  | UseCompanyInventoryDataLoading
  | UseCompanyInventoryDataError
  | UseCompanyInventoryDataSuccess;

export const useCompanyInventoryData = (
  companyId: Id<"companies"> | null
): UseCompanyInventoryDataResult => {
  const response = useQuery<
    typeof api.items.getItemsAndCategoriesAndRoomsByCompany
  >(
    api.items.getItemsAndCategoriesAndRoomsByCompany,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load inventory data.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: {
      items: response.data.items,
      categories: response.data.categories,
      rooms: response.data.rooms,
    },
  };
};
