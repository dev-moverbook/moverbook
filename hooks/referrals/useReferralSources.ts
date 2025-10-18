"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { SelectOption } from "@/types/types";

export const useReferralSources = (
  companyId: Id<"companies">,
  { enabled = true }: { enabled?: boolean } = {}
): { options: SelectOption[] } => {
  const response = useQuery(
    api.referrals.getActiveReferralsByCompanyId,
    enabled ? { companyId } : "skip"
  );

  if (!response) {
    return { options: [] };
  }

  return {
    options:
      response.map((referral) => ({
        label: referral.name,
        value: referral.name,
      })) ?? [],
  };
};
