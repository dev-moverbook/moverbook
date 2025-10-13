"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useDeleteItem = () => {
  const [deleteItemLoading, setDeleteItemLoading] = useState<boolean>(false);
  const [deleteItemError, setDeleteItemError] = useState<string | null>(null);

  const deleteItemMutation = useMutation(api.items.updateItem);

  const deleteItem = async (itemId: Id<"items">): Promise<boolean> => {
    setDeleteItemLoading(true);
    setDeleteItemError(null);

    try {
      await deleteItemMutation({
        itemId,
        updates: { isActive: false },
      });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setDeleteItemError);
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
