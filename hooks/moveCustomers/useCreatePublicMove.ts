"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { ServiceType } from "@/types/types";

interface CreatePublicMoveInput {
  companyId: Id<"companies">;
  name: string;
  email: string;
  phoneNumber: string;
  altPhoneNumber: string;
  serviceType: ServiceType;
}

export const useCreatePublicMove = () => {
  const [createPublicMoveLoading, setCreatePublicMoveLoading] =
    useState<boolean>(false);
  const [createPublicMoveError, setCreatePublicMoveError] = useState<
    string | null
  >(null);

  const createPublicMoveMutation = useAction(
    api.moveCustomers.createPublicMove
  );

  const createPublicMove = async (
    data: CreatePublicMoveInput
  ): Promise<boolean> => {
    setCreatePublicMoveLoading(true);
    setCreatePublicMoveError(null);

    try {
      return await createPublicMoveMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setCreatePublicMoveError);
      return false;
    } finally {
      setCreatePublicMoveLoading(false);
    }
  };

  return {
    createPublicMove,
    createPublicMoveLoading,
    createPublicMoveError,
    setCreatePublicMoveError,
  };
};
