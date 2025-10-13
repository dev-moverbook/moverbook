"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface UpdateCategoryData {
  name?: string;
}

export const useUpdateCategory = () => {
  const [updateCategoryLoading, setUpdateCategoryLoading] =
    useState<boolean>(false);
  const [updateCategoryError, setUpdateCategoryError] = useState<string | null>(
    null
  );

  const updateCategoryMutation = useMutation(api.categories.updateCategory);

  const updateCategory = async (
    categoryId: Id<"categories">,
    updates: UpdateCategoryData
  ): Promise<boolean> => {
    setUpdateCategoryLoading(true);
    setUpdateCategoryError(null);

    try {
      const response = await updateCategoryMutation({ categoryId, updates });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setUpdateCategoryError);
      return false;
    } finally {
      setUpdateCategoryLoading(false);
    }
  };

  return {
    updateCategory,
    updateCategoryLoading,
    updateCategoryError,
    setUpdateCategoryError,
  };
};
