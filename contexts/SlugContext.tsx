"use client";

import React, { createContext, useContext } from "react";
import { ErrorMessages } from "@/types/errors";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FullLoading from "@/components/shared/skeleton/FullLoading";
import { useUser } from "@clerk/nextjs";
import ErrorMessage from "@/components/shared/error/ErrorMessage";

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
  children,
}: {
  initialSlug: string;
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const company = useQuery(
    api.companies.getCompanyIdBySlug,
    user ? { slug } : "skip"
  );

  if (!company || user === undefined) {
    return <FullLoading />;
  }

  if (user === null) {
    return <ErrorMessage message="You must be signed in to view this page." />;
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
