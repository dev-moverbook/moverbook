"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import FullLoading from "../components/shared/FullLoading";
import { useUser } from "@clerk/nextjs";
import ErrorMessage from "../components/shared/error/ErrorMessage";
import { UserResource } from "@clerk/types";

interface SlugContextType {
  slug: string;
  companyId: Id<"companies">;
  timeZone: string;
  isCompanyContactComplete?: boolean;
  isStripeComplete?: boolean;
  user: UserResource;
}

const SlugContext = createContext<SlugContextType | undefined>(undefined);

export const SlugProvider = ({
  initialSlug: slug,
  children,
}: {
  initialSlug: string;
  children: React.ReactNode;
}) => {
  const { isLoaded, user } = useUser();

  const companyIdQuery = useQuery(api.companies.getCompanyIdBySlug, { slug });

  const isCompanyContactComplete =
    companyIdQuery?.isCompanyContactComplete ?? false;
  const isStripeComplete = companyIdQuery?.isStripeComplete ?? false;

  if (!companyIdQuery || !isLoaded) {
    return <FullLoading />;
  }

  if (!user) {
    return (
      <ErrorMessage message={"You must be signed in to view this page."} />
    );
  }

  return (
    <SlugContext.Provider
      value={{
        slug,
        companyId: companyIdQuery.companyId,
        timeZone: companyIdQuery.timeZone,
        isCompanyContactComplete,
        isStripeComplete,
        user,
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
