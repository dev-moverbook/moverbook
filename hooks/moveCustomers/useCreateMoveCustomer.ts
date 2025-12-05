"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { newCustomerResponse } from "@/types/convex-responses";

interface CreateMoveCustomerInput {
  companyId: Id<"companies">;
  name: string;
  email: string;
  phoneNumber: string;
  altPhoneNumber: string;
}

export const useCreateMoveCustomer = () => {
  const [createMoveCustomerLoading, setLoading] = useState<boolean>(false);
  const [createMoveCustomerError, setError] = useState<string | null>(null);

  const createMoveCustomerMutation = useMutation(api.users.createMoveCustomer);

  const createMoveCustomer = async (
    data: CreateMoveCustomerInput
  ): Promise<newCustomerResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      return await createMoveCustomerMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
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
