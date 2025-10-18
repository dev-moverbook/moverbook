"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { GetItemsAndCategoriesAndRoomsByCompanyData } from "@/types/convex-responses";

export const useCompanyInventoryData = (
  companyId: Id<"companies">
): GetItemsAndCategoriesAndRoomsByCompanyData | undefined => {
  const result = useQuery<
    typeof api.items.getItemsAndCategoriesAndRoomsByCompany
  >(api.items.getItemsAndCategoriesAndRoomsByCompany, { companyId });

  return result;
};
