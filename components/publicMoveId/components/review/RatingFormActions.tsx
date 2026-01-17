"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { useCompleteReview } from "@/hooks/internalReviews";

interface RatingFormActionsProps {
  rating: number;
}

const RatingFormActions = ({ rating }: RatingFormActionsProps) => {
  const { move } = usePublicMoveIdContext();
  const { completeReview, loading, error } = useCompleteReview();

  const handleCompleteReview = async () => {
    await completeReview(move.move._id, rating);
  };
  return (
    <SingleFormAction
      onSubmit={handleCompleteReview}
      isSubmitting={loading}
      error={error}
      submitLabel="Complete Review"
    />
  );
};

export default RatingFormActions;
