"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useMoveCustomerStripeProfiles = (
  moveCustomerId: Id<"users">,
  companyId: Id<"companies">
): Doc<"moveCustomerStripeProfiles"> | undefined | null => {
  const response = useQuery<
    typeof api.moveCustomerStripeProfiles.getByMoveCustomerAndCompany
  >(api.moveCustomerStripeProfiles.getByMoveCustomerAndCompany, {
    moveCustomerId,
    companyId,
  });

  return response;
};
