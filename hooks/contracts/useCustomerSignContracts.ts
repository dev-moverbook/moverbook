"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface ContractUpdates {
  customerSignature: string;
}

export const useCustomerSignContract = () => {
  const [customerSignContractLoading, setCustomerSignContractLoading] =
    useState<boolean>(false);
  const [customerSignContractError, setCustomerSignContractError] = useState<
    string | null
  >(null);

  const mutationFn = useMutation(api.contracts.customerUpdateContract);

  const customerSignContract = async (
    contractId: Id<"contracts">,
    updates: ContractUpdates
  ): Promise<boolean> => {
    setCustomerSignContractLoading(true);
    setCustomerSignContractError(null);

    try {
      return await mutationFn({ contractId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setCustomerSignContractError);
      return false;
    } finally {
      setCustomerSignContractLoading(false);
    }
  };

  return {
    customerSignContract,
    customerSignContractLoading,
    customerSignContractError,
    setCustomerSignContractError,
  };
};
