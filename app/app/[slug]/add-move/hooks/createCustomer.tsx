"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Doc } from "@/convex/_generated/dataModel";

interface CreateMoveCustomerInput {
  companyId: Id<"companies">;
  name: string;
  email: string;
  phoneNumber: string;
  altPhoneNumber: string | null;
  referral: string | null;
}

interface CreateMoveCustomerResult {
  success: boolean;
  moveCustomerId?: Id<"moveCustomers">;
  existingCustomer?: Doc<"moveCustomers">;
}

export const useCreateMoveCustomer = () => {
  const [createMoveCustomerLoading, setLoading] = useState<boolean>(false);
  const [createMoveCustomerError, setError] = useState<string | null>(null);

  const createMoveCustomerMutation = useMutation(
    api.moveCustomers.createMoveCustomer
  );

  const createMoveCustomer = async (
    data: CreateMoveCustomerInput
  ): Promise<CreateMoveCustomerResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await createMoveCustomerMutation(data);

      if (response.status === ResponseStatus.SUCCESS) {
        // Return the appropriate result
        if ("moveCustomerId" in response.data) {
          return {
            success: true,
            moveCustomerId: response.data.moveCustomerId,
          };
        }

        if ("moveCustomer" in response.data) {
          return {
            success: true,
            existingCustomer: response.data.moveCustomer,
          };
        }
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
    createMoveCustomer,
    createMoveCustomerLoading,
    createMoveCustomerError,
    setCreateMoveCustomerError: setError,
  };
};
