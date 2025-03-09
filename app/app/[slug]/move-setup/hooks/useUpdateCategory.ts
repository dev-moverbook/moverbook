"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateCategoryError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateCategoryError(FrontEndErrorMessages.GENERIC);
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
