"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useDeleteItem = () => {
  const [deleteItemLoading, setDeleteItemLoading] = useState<boolean>(false);
  const [deleteItemError, setDeleteItemError] = useState<string | null>(null);

  const deleteItemMutation = useMutation(api.items.updateItem);

  const deleteItem = async (itemId: Id<"items">): Promise<boolean> => {
    setDeleteItemLoading(true);
    setDeleteItemError(null);

    try {
      const response = await deleteItemMutation({
        itemId,
        updates: { isActive: false },
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setDeleteItemError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setDeleteItemError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setDeleteItemLoading(false);
    }
  };

  return {
    deleteItem,
    deleteItemLoading,
    deleteItemError,
    setDeleteItemError,
  };
};
