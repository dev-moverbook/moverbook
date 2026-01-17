"use client";

import FullLoading from "@/components/shared/skeleton/FullLoading";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { useInternalReview } from "@/hooks/internalReviews";
import PublicMoveReview from "./PublicMoveReview";

const ReviewLoader = () => {
  const { move } = usePublicMoveIdContext();

  const internalReview = useInternalReview(move.move._id);

  if (internalReview === undefined) {
    return <FullLoading />;
  }

  return <PublicMoveReview internalReview={internalReview} />;
};

export default ReviewLoader;
