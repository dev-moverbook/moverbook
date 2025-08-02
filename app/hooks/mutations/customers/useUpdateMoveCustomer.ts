"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

interface UpdateMoveCustomerInput {
  moveCustomerId: Id<"moveCustomers">;
  updates: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    altPhoneNumber?: string | null;
    referral?: string | null;
  };
}

interface UpdateMoveCustomerResult {
  success: boolean;
  moveCustomerId?: Id<"moveCustomers">;
}

export const useUpdateMoveCustomer = () => {
  const [updateMoveCustomerLoading, setLoading] = useState<boolean>(false);
  const [updateMoveCustomerError, setError] = useState<string | null>(null);

  const updateMoveCustomerMutation = useMutation(
    api.moveCustomers.updateMoveCustomer
  );

  const updateMoveCustomer = async (
    data: UpdateMoveCustomerInput
  ): Promise<UpdateMoveCustomerResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateMoveCustomerMutation(data);

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          moveCustomerId: response.data.moveCustomerId,
        };
      }

      console.error(response.data);
      setError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setError(FrontEndErrorMessages.GENERIC);
      return { success: false };
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
