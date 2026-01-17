"use client";

import StarRating from "@/components/move/shared/StarRanking";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import RatingFormActions from "./RatingFormActions";

interface PublicMoveReviewProps {
  internalReview: Doc<"internalReviews"> | null;
}

const PublicMoveReview = ({ internalReview }: PublicMoveReviewProps) => {
  const isComplete = !!internalReview?.rating;
  const [rating, setRating] = useState<number | null>(null);

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  return (
    <div>
      <SectionHeader
        className="mx-auto"
        title="Internal Review"
        showCheckmark
        isCompleted={isComplete}
      />
      <SectionContainer>
        <StarRating
          onChange={handleRatingChange}
          value={internalReview?.rating ?? rating}
          readOnly={isComplete}
        />
        {rating && !isComplete && <RatingFormActions rating={rating} />}
      </SectionContainer>
    </div>
  );
};

export default PublicMoveReview;
