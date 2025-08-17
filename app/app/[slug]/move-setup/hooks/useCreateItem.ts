"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { ItemFormData } from "@/types/form-types";

export type ItemCreateInput = Omit<ItemFormData, "size" | "weight"> & {
  size: number;
  weight: number;
};

export const useCreateItem = () => {
  const [createItemLoading, setCreateItemLoading] = useState(false);
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
      const response = await createItemMutation({
        companyId,
        ...itemData,
        categoryId,
      });

      if (response.status === ResponseStatus.SUCCESS) return true;

      console.error(response.error);
      setCreateItemError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateItemError(FrontEndErrorMessages.GENERIC);
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
