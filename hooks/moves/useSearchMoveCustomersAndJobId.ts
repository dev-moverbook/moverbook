"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { EnrichedMoveForMover } from "@/types/convex-responses";

export const useSearchMoveCustomersAndJobId = (
  companyId: Id<"companies">,
  searchTerm: string
):
  | { moveCustomers: Doc<"users">[]; moves: EnrichedMoveForMover[] }
  | undefined => {
  const trimmed = searchTerm?.trim() ?? "";

  const response = useQuery(
    api.moveCustomers.searchMoveCustomersAndJobId,
    trimmed ? { companyId, searchTerm: trimmed } : "skip"
  );

  return response;
};
