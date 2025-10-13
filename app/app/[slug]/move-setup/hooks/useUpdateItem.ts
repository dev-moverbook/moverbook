"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ItemCreateInput } from "./useCreateItem";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useUpdateItem = () => {
  const [updateItemLoading, setUpdateItemLoading] = useState<boolean>(false);
  const [updateItemError, setUpdateItemError] = useState<string | null>(null);

  const updateItemMutation = useMutation(api.items.updateItem);

  const updateItem = async (
    itemId: Id<"items">,
    updates: ItemCreateInput
  ): Promise<boolean> => {
    setUpdateItemLoading(true);
    setUpdateItemError(null);

    try {
      await updateItemMutation({ itemId, updates });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setUpdateItemError);
      return false;
    } finally {
      setUpdateItemLoading(false);
    }
  };

  return {
    updateItem,
    updateItemLoading,
    updateItemError,
    setUpdateItemError,
  };
};
