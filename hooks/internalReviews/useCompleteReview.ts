import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useCompleteReview = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const completeReviewMutation = useMutation(
    api.internalReviews.createInternalReview
  );

  const completeReview = async (
    moveId: Id<"moves">,
    rating: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      return await completeReviewMutation({
        moveId,
        rating,
      });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { completeReview, loading, error };
};
