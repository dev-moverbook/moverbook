"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useTwilioPhoneNumber = (
  companyId: Id<"companies">
): Doc<"twilioPhoneNumbers"> | undefined | null => {
  const response = useQuery<typeof api.twilioPhoneNumbers.getPhoneNumber>(
    api.twilioPhoneNumbers.getPhoneNumber,
    { companyId }
  );

  return response;
};
