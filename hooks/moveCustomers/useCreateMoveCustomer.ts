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
  altPhoneNumber?: string;
}

export const useCreateMoveCustomer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createMoveCustomerMutation = useMutation(
    api.moveCustomers.createMoveCustomer
  );

  const createMoveCustomer = async (
    data: CreateMoveCustomerInput
  ): Promise<newCustomerResponse | null> => {
    setIsLoading(true);
    setError(null);

    const cleanedData = {
      ...data,
      altPhoneNumber: data.altPhoneNumber?.trim() === "" 
        ? undefined 
        : data.altPhoneNumber,
    };

    try {
      return await createMoveCustomerMutation(cleanedData);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMoveCustomer,
    isLoading,
    error,
    setError,
  };
};