"use client";

import React, { createContext, useContext } from "react";
import { ErrorMessages } from "@/types/errors";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FullLoading from "@/components/shared/skeleton/FullLoading";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
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
  const { user, isLoaded } = useUser();

  // ✅ Hook is ALWAYS called
  const company = useQuery(
    api.companies.getCompanyIdBySlug,
    isLoaded && user ? { slug } : "skip"
  );

  // 1️⃣ Wait for Clerk
  if (!isLoaded) {
    return <FullLoading />;
  }

  // 2️⃣ Signed out
  if (!user) {
    return <RedirectToSignIn />;
  }

  // 3️⃣ Data loading
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
