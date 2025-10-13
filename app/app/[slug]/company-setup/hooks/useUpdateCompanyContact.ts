import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { AddressInput } from "@/types/form-types";

interface UpdateCompanyContactData {
  email?: string;
  phoneNumber?: string;
  address?: AddressInput;
  website?: string;
}

export const useUpdateCompanyContact = () => {
  const [updateCompanyContactLoading, setUpdateCompanyContactLoading] =
    useState<boolean>(false);
  const [updateCompanyContactError, setUpdateCompanyContactError] = useState<
    string | null
  >(null);

  const updateCompanyContactMutation = useMutation(
    api.companyContact.updateCompanyContact
  );

  const updateCompanyContact = async (
    companyContactId: Id<"companyContact">,
    updates: UpdateCompanyContactData
  ): Promise<boolean> => {
    setUpdateCompanyContactLoading(true);
    setUpdateCompanyContactError(null);

    try {
      const response = await updateCompanyContactMutation({
        companyContactId,
        updates,
      });

      return true;
    } catch (error) {
      console.error(error);
      setUpdateCompanyContactError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUpdateCompanyContactLoading(false);
    }
  };

  return {
    updateCompanyContact,
    updateCompanyContactLoading,
    updateCompanyContactError,
    setUpdateCompanyContactError,
  };
};
