import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

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

      return { success: true, data: response };
    } catch (error) {
      setErrorFromConvexError(error, setCreateCompanyError);
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
