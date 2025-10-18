"use client";

import React, { createContext, useContext } from "react";
import { ErrorMessages } from "@/types/errors";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { GetCompanyIdBySlugResponse } from "@/types/convex-responses";

interface SlugContextType {
  slug: string;
  companyId: Id<"companies">;
  timeZone: string;
  isCompanyContactComplete?: boolean;
  isStripeComplete?: boolean;
  user: Doc<"users">;
}

const SlugContext = createContext<SlugContextType | undefined>(undefined);

export const SlugProvider = ({
  initialSlug: slug,
  company,
  children,
}: {
  initialSlug: string;
  company: GetCompanyIdBySlugResponse;
  children: React.ReactNode;
}) => {
  return (
    <SlugContext.Provider
      value={{
        slug,
        companyId: company.companyId,
        timeZone: company.timeZone,
        isCompanyContactComplete: company.isCompanyContactComplete,
        isStripeComplete: company.isStripeComplete,
        user: company.user,
      }}
    >
      {children}
    </SlugContext.Provider>
  );
};

export const useSlugContext = () => {
  const context = useContext(SlugContext);
  if (!context) {
    throw new Error(ErrorMessages.CONTEXT_SLUG_PROVER);
  }
  return context;
};
