"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { DeliveryType } from "@/types/types";

// To Be Deleted

export const useSendWaiver = () => {
  const [sendWaiverLoading, setSendWaiverLoading] = useState<boolean>(false);
  const [sendWaiverError, setSendWaiverError] = useState<string | null>(null);

  const sendWaiverAction = useAction(api.waivers.sendWaiver);

  const sendWaiver = async (
    moveId: Id<"moves">,
    channel: DeliveryType
  ): Promise<boolean> => {
    setSendWaiverLoading(true);
    setSendWaiverError(null);

    try {
      return await sendWaiverAction({ moveId, channel });
    } catch (error) {
      setErrorFromConvexError(error, setSendWaiverError);
      return false;
    } finally {
      setSendWaiverLoading(false);
    }
  };

  return {
    sendWaiver,
    sendWaiverLoading,
    sendWaiverError,
    setSendWaiverError,
  };
};
