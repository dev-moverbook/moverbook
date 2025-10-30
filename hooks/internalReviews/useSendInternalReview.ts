"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { DeliveryType } from "@/types/types";

export const useSendInternalReview = () => {
  const [sendInternalReviewLoading, setSendInternalReviewLoading] =
    useState<boolean>(false);
  const [sendInternalReviewError, setSendInternalReviewError] = useState<
    string | null
  >(null);

  const sendInternalReviewAction = useAction(
    api.internalReviews.sendInternalReview
  );

  const sendInternalReview = async (
    moveId: Id<"moves">,
    channel: DeliveryType
  ): Promise<boolean> => {
    setSendInternalReviewLoading(true);
    setSendInternalReviewError(null);

    try {
      return await sendInternalReviewAction({ moveId, channel });
    } catch (error) {
      setErrorFromConvexError(error, setSendInternalReviewError);
      return false;
    } finally {
      setSendInternalReviewLoading(false);
    }
  };

  return {
    sendInternalReview,
    sendInternalReviewLoading,
    sendInternalReviewError,
    setSendInternalReviewError,
  };
};
