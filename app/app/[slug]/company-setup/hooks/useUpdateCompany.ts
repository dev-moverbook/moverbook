import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { UpdateCompanyData } from "@/types/form-types";

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
  ): Promise<boolean> => {
    setUpdateCompanyLoading(true);
    setUpdateCompanyError(null);

    try {
      const response = await updateCompanyAction({ companyId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateCompanyError(response.error || FrontEndErrorMessages.GENERIC);
      return false;
    } catch (error) {
      console.error(error);
      setUpdateCompanyError(FrontEndErrorMessages.GENERIC);
      return false;
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
