"use client";

import React, { createContext, useContext } from "react";
import { ErrorMessages } from "@/types/errors";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FullLoading from "@/components/shared/skeleton/FullLoading";
import { useUser } from "@clerk/nextjs";

interface SlugContextType {
  slug: string;
  companyId: Id<"companies">;
  timeZone: string;
  isCompanyContactComplete?: boolean;
  isStripeComplete?: boolean;
  user: Doc<"users"> | null;
}

const SlugContext = createContext<SlugContextType | undefined>(undefined);

export const SlugProvider = ({
  initialSlug: slug,
  children,
}: {
  initialSlug: string;
  children: React.ReactNode;
}) => {
  const { isLoaded } = useUser();

  const company = useQuery(
    api.companies.getCompanyIdBySlug,
    isLoaded ? { slug } : "skip"
  );

  if (!isLoaded) {
    return <FullLoading />;
  }

  if (!company) {
    return <FullLoading />;
  }

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
