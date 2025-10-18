"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface CreateMoveCustomerInput {
  companyId: Id<"companies">;
  name: string;
  email: string;
  phoneNumber: string;
  altPhoneNumber: string;
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

      if (response) {
        if ("moveCustomerId" in response) {
          return {
            success: true,
            moveCustomerId: response,
          };
        }

        if ("moveCustomer" in response) {
          return {
            success: true,
            moveCustomerId: response,
          };
        }
      }
      return { success: false };
    } catch (error) {
      setErrorFromConvexError(error, setError);
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
