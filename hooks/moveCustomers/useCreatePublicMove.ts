"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { ServiceType } from "@/types/types";
import { emptyToUndefined } from "@/utils/strings";

interface CreatePublicMoveInput {
  companyId: Id<"companies">;
  name: string;
  email: string;
  phoneNumber: string;
  altPhoneNumber: string;
  serviceType: ServiceType;
}

export const useCreatePublicMove = () => {
  const [isLoading, setIsLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<
    string | null
  >(null);

  const createPublicMoveMutation = useAction(
    api.actions.messages.createPublicMove
  );

  const createPublicMove = async (
    data: CreatePublicMoveInput
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        altPhoneNumber: emptyToUndefined(data.altPhoneNumber),      };

      return await createPublicMoveMutation(payload);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPublicMove,
    isLoading,
    error,
    setError,
  };
};