import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

export const useCreateCompany = () => {
  const [createCompanyLoading, setCreateCompanyLoading] = useState(false);
  const [createCompanyError, setCreateCompanyError] = useState<string | null>(
    null
  );

  const createOrganizationAction = useAction(api.clerk.createOrganization);

  const createCompany = async (
    name: string
  ): Promise<{
    success: boolean;
    data?: { slug: string; clerkOrganizationId: string };
  }> => {
    setCreateCompanyLoading(true);
    setCreateCompanyError(null);

    try {
      const response = await createOrganizationAction({ name });

      if (response.status !== ResponseStatus.SUCCESS) {
        setCreateCompanyError(response.error ?? FrontEndErrorMessages.GENERIC);
        return { success: false };
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error creating organization:", error);
      setCreateCompanyError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setCreateCompanyLoading(false);
    }
  };

  return {
    createCompany,
    createCompanyLoading,
    createCompanyError,
    setCreateCompanyError,
  };
};
