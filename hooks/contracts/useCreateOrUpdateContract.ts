"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface ContractUpdates {
  customerSignature?: string;
  customerSignedAt?: number;
  repSignature?: string;
  repSignedAt?: number;
}

export const useCreateOrUpdateContract = () => {
  const [createOrUpdateContractLoading, setCreateOrUpdateContractLoading] =
    useState<boolean>(false);
  const [createOrUpdateContractError, setCreateOrUpdateContractError] =
    useState<string | null>(null);

  const mutationFn = useMutation(api.contracts.createOrUpdateContract);

  const createOrUpdateContract = async (
    moveId: Id<"moves">,
    updates: ContractUpdates
  ): Promise<boolean> => {
    setCreateOrUpdateContractLoading(true);
    setCreateOrUpdateContractError(null);

    try {
      return await mutationFn({ moveId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setCreateOrUpdateContractError);
      return false;
    } finally {
      setCreateOrUpdateContractLoading(false);
    }
  };

  return {
    createOrUpdateContract,
    createOrUpdateContractLoading,
    createOrUpdateContractError,
    setCreateOrUpdateContractError,
  };
};
