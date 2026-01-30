"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface UpdateMoveCustomerInput {
  moveCustomerId: Id<"moveCustomers">;
  companyId: Id<"companies">;
  updates: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    altPhoneNumber?: string;
  };
  moveId?: Id<"moves">;
}

export const useUpdateMoveCustomer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateMoveCustomerMutation = useMutation(
    api.moveCustomers.updateMoveCustomer
  );

  const updateMoveCustomer = async (
    data: UpdateMoveCustomerInput
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const cleanedUpdates = {
      ...data.updates,
      altPhoneNumber: data.updates.altPhoneNumber?.trim() === "" 
        ? undefined 
        : data.updates.altPhoneNumber,
    };

    try {
      return await updateMoveCustomerMutation({
        ...data,
        updates: cleanedUpdates
      });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateMoveCustomer,
    isLoading,
    error,
    setError,
  };
};