"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useDeleteCategory = () => {
  const [deleteCategoryLoading, setDeleteCategoryLoading] =
    useState<boolean>(false);
  const [deleteCategoryError, setDeleteCategoryError] = useState<string | null>(
    null
  );

  const deleteCategoryMutation = useMutation(api.categories.updateCategory);

  const deleteCategory = async (
    categoryId: Id<"categories">
  ): Promise<boolean> => {
    setDeleteCategoryLoading(true);
    setDeleteCategoryError(null);

    try {
      const response = await deleteCategoryMutation({
        categoryId,
        updates: { isActive: false },
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setDeleteCategoryError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setDeleteCategoryError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setDeleteCategoryLoading(false);
    }
  };

  return {
    deleteCategory,
    deleteCategoryLoading,
    deleteCategoryError,
    setDeleteCategoryError,
  };
};
