"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { RecentMoveMessageSummary } from "@/types/types";

export const useRecentMessagesByCompanyId = (
  companyId: Id<"companies">
): RecentMoveMessageSummary[] | undefined => {
  const response = useQuery(api.messages.getRecentMessagesByCompanyId, {
    companyId,
  });

  return response;
};
