"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { CategoryFormData } from "@/types/form-types"; // Ensure this type exists

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
      const response = await createCategoryMutation({
        companyId,
        ...categoryData,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setCreateCategoryError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateCategoryError(FrontEndErrorMessages.GENERIC);
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
