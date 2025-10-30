"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { DeliveryType } from "@/types/types";

export const useSendExternalReview = () => {
  const [sendExternalReviewLoading, setSendExternalReviewLoading] =
    useState<boolean>(false);
  const [sendExternalReviewError, setSendExternalReviewError] = useState<
    string | null
  >(null);

  const sendExternalReviewAction = useAction(
    api.externalReviews.sendExternalReview
  );

  const sendExternalReview = async (
    moveId: Id<"moves">,
    channel: DeliveryType
  ): Promise<boolean> => {
    setSendExternalReviewLoading(true);
    setSendExternalReviewError(null);

    try {
      return await sendExternalReviewAction({ moveId, channel });
    } catch (error) {
      setErrorFromConvexError(error, setSendExternalReviewError);
      return false;
    } finally {
      setSendExternalReviewLoading(false);
    }
  };

  return {
    sendExternalReview,
    sendExternalReviewLoading,
    sendExternalReviewError,
    setSendExternalReviewError,
  };
};
