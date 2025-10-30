"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useCompanyArrival = (
  companyId: Id<"companies">,
  { enabled = true }: { enabled?: boolean } = {}
): Doc<"arrivalWindows"> | undefined => {
  const response = useQuery(
    api.arrivalWindows.getCompanyArrival,
    enabled ? { companyId } : "skip"
  );

  return response;
};
