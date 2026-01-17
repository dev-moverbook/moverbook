"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useInternalReview = (
  moveId: Id<"moves">
): Doc<"internalReviews"> | undefined | null => {
  const response = useQuery<typeof api.internalReviews.getInternalReview>(
    api.internalReviews.getInternalReview,
    { moveId }
  );

  return response;
};
