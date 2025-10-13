"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ItemFormData } from "@/types/form-types";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export type ItemCreateInput = Omit<ItemFormData, "size" | "weight"> & {
  size: number;
  weight: number;
};

export const useCreateItem = () => {
  const [createItemLoading, setCreateItemLoading] = useState<boolean>(false);
  const [createItemError, setCreateItemError] = useState<string | null>(null);

  const createItemMutation = useMutation(api.items.createItem);

  const createItem = async (
    companyId: Id<"companies">,
    itemData: ItemCreateInput,
    categoryId?: Id<"categories">
  ): Promise<boolean> => {
    setCreateItemLoading(true);
    setCreateItemError(null);

    try {
      return await createItemMutation({
        companyId,
        ...itemData,
        categoryId,
      });
    } catch (error) {
      setErrorFromConvexError(error, setCreateItemError);
      return false;
    } finally {
      setCreateItemLoading(false);
    }
  };

  return {
    createItem,
    createItemLoading,
    createItemError,
    setCreateItemError,
  };
};
