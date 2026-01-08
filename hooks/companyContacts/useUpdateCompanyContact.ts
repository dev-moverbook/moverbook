import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AddressInput } from "@/types/form-types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

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
    api.companyContacts.updateCompanyContact
  );

  const updateCompanyContact = async (
    companyContactId: Id<"companyContacts">,
    updates: UpdateCompanyContactData
  ): Promise<boolean> => {
    setUpdateCompanyContactLoading(true);
    setUpdateCompanyContactError(null);

    try {
      return await updateCompanyContactMutation({
        companyContactId,
        updates,
      });
    } catch (error) {
      setErrorFromConvexError(error, setUpdateCompanyContactError);
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
