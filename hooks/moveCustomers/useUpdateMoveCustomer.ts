"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface UpdateMoveCustomerInput {
  moveCustomerId: Id<"users">;
  companyId: Id<"companies">;
  updates: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    altPhoneNumber?: string;
  };
}

export const useUpdateMoveCustomer = () => {
  const [updateMoveCustomerLoading, setLoading] = useState<boolean>(false);
  const [updateMoveCustomerError, setError] = useState<string | null>(null);

  const updateMoveCustomerMutation = useMutation(api.users.updateMoveCustomer);

  const updateMoveCustomer = async (
    data: UpdateMoveCustomerInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      return await updateMoveCustomerMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateMoveCustomer,
    updateMoveCustomerLoading,
    updateMoveCustomerError,
    setUpdateMoveCustomerError: setError,
  };
};
