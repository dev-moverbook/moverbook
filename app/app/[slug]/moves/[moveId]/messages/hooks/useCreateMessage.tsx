"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { CommunicationType } from "@/types/types";

interface CreateMessageArgs {
  moveId: Id<"move">;
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

  const createMessageMutation = useAction(api.messages.createMessage);

  const createMessage = async ({
    moveId,
    method,
    message,

    subject,
  }: CreateMessageArgs): Promise<boolean> => {
    setCreateMessageLoading(true);
    setCreateMessageError(null);

    try {
      const response = await createMessageMutation({
        moveId,
        method,
        message,
        subject,
        sentType: "outgoing",
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setCreateMessageError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateMessageError(FrontEndErrorMessages.GENERIC);
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
