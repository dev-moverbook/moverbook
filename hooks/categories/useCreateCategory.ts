"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CategoryFormData } from "@/types/form-types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useCreateCategory = () => {
  const [createCategoryLoading, setCreateCategoryLoading] =
    useState<boolean>(false);
  const [createCategoryError, setCreateCategoryError] = useState<string | null>(
    null
  );

  const createCategoryMutation = useMutation(api.categories.createCategory);

  const createCategory = async (
    companyId: Id<"companies">,
    categoryData: CategoryFormData
  ): Promise<boolean> => {
    setCreateCategoryLoading(true);
    setCreateCategoryError(null);

    try {
      return await createCategoryMutation({
        companyId,
        ...categoryData,
      });
    } catch (error) {
      setErrorFromConvexError(error, setCreateCategoryError);
      return false;
    } finally {
      setCreateCategoryLoading(false);
    }
  };

  return {
    createCategory,
    createCategoryLoading,
    createCategoryError,
    setCreateCategoryError,
  };
};
