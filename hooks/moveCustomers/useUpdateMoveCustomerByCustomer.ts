"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface UpdateMoveCustomerInput {
  moveCustomerId: Id<"users">;
  companyId: Id<"companies">;
  moveId: Id<"moves">;
  updates: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    altPhoneNumber?: string;
  };
}

export const useUpdateMoveCustomerByCustomer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateMoveCustomerAction = useAction(
    api.moveCustomers.updateUserAsCustomer
  );

  const updateMoveCustomerByCustomer = async (
    data: UpdateMoveCustomerInput
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await updateMoveCustomerAction({
        userId: data.moveCustomerId,
        companyId: data.companyId,
        updates: data.updates,
        moveId: data.moveId,
      });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateMoveCustomerByCustomer,
    isLoading,
    error,
    setError,
  };
};
