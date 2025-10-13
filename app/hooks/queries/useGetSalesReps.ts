"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useGetSalesReps = (
  companyId: Id<"companies">
): Doc<"users">[] | undefined => {
  const response = useQuery<typeof api.users.getSalesRepsByCompanyId>(
    api.users.getSalesRepsByCompanyId,
    { companyId }
  );

  return response;
};
