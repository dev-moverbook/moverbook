"use client";

import { useState } from "react";
import { useOrganization } from "@clerk/clerk-react";
import { FrontEndErrorMessages } from "@/types/errors";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";

export const useUpdateOrganizationLogo = () => {
  const { organization } = useOrganization();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateCompanyLogo = useMutation(api.companies.updateCompanyLogo);

  const uploadOrganizationLogo = async (
    companyId: Id<"companies">,
    file: File
  ): Promise<boolean> => {
    setUploadLoading(true);
    setUploadError(null);

    try {
      if (!organization) {
        throw new Error(FrontEndErrorMessages.NO_ORGANIZATION_SELECTED);
      }

      const updatedOrganization = await organization.setLogo({ file });
      const response = await updateCompanyLogo({
        companyId,
        imageUrl: updatedOrganization.imageUrl,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }
      console.error(response.error);
      setUploadError(response.error);
      return false;
    } catch (error) {
      console.error("Error updating organization logo:", error);
      setUploadError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUploadLoading(false);
    }
  };

  return {
    uploadOrganizationLogo,
    uploadLoading,
    uploadError,
    setUploadError,
  };
};
