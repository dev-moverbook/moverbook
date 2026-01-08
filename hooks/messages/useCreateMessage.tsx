"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CommunicationType } from "@/types/types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface CreateMessageArgs {
  moveId: Id<"moves">;
  method: CommunicationType;
  message: string;
  subject?: string | null;
}

export const useCreateMessage = () => {
  const [createMessageLoading, setCreateMessageLoading] =
    useState<boolean>(false);
  const [createMessageError, setCreateMessageError] = useState<string | null>(
    null
  );

  const createMessageMutation = useAction(api.actions.messages.createMessage);

  const createMessage = async ({
    moveId,
    method,
    message,

    subject,
  }: CreateMessageArgs): Promise<boolean> => {
    setCreateMessageLoading(true);
    setCreateMessageError(null);

    try {
      return await createMessageMutation({
        moveId,
        method,
        message,
        subject,
        sentType: "outgoing",
      });
    } catch (error) {
      setErrorFromConvexError(error, setCreateMessageError);
      return false;
    } finally {
      setCreateMessageLoading(false);
    }
  };

  return {
    createMessage,
    createMessageLoading,
    createMessageError,
    setCreateMessageError,
  };
};
