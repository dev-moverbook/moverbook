"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { ItemFormData } from "@/types/form-types";

export const useUpdateItem = () => {
  const [updateItemLoading, setUpdateItemLoading] = useState<boolean>(false);
  const [updateItemError, setUpdateItemError] = useState<string | null>(null);

  const updateItemMutation = useMutation(api.items.updateItem);

  const updateItem = async (
    itemId: Id<"items">,
    updates: ItemFormData
  ): Promise<boolean> => {
    setUpdateItemLoading(true);
    setUpdateItemError(null);

    try {
      const response = await updateItemMutation({ itemId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateItemError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateItemError(FrontEndErrorMessages.GENERIC);
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
