import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UpdateCompanyData } from "@/types/form-types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useUpdateCompany = () => {
  const [updateCompanyLoading, setUpdateCompanyLoading] =
    useState<boolean>(false);
  const [updateCompanyError, setUpdateCompanyError] = useState<string | null>(
    null
  );

  const updateCompanyAction = useAction(api.companies.updateCompany);

  const updateCompany = async (
    companyId: Id<"companies">,
    updates: UpdateCompanyData
  ): Promise<{ success: boolean; newSlug?: string }> => {
    setUpdateCompanyLoading(true);
    setUpdateCompanyError(null);

    try {
      const response = await updateCompanyAction({ companyId, updates });

      return { success: false, newSlug: response.slug };
    } catch (error) {
      setErrorFromConvexError(error, setUpdateCompanyError);
      return { success: false };
    } finally {
      setUpdateCompanyLoading(false);
    }
  };

  return {
    updateCompany,
    updateCompanyLoading,
    updateCompanyError,
    setUpdateCompanyError,
  };
};
