"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
      await deleteCategoryMutation({
        categoryId,
        updates: { isActive: false },
      });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setDeleteCategoryError);
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
