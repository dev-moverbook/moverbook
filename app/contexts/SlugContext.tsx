"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import FullLoading from "../components/shared/FullLoading";
import { useUser } from "@clerk/nextjs";
import ErrorMessage from "../components/shared/error/ErrorMessage";
import { UserResource } from "@clerk/types";

interface SlugContextType {
  slug: string | null;
  setSlug: (slug: string) => void;
  companyId: Id<"companies"> | null;
  timeZone: string;
  isCompanyContactComplete?: boolean;
  isStripeComplete?: boolean;
  user: UserResource;
}

const SlugContext = createContext<SlugContextType | undefined>(undefined);

export const SlugProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const rawSlug = typeof params?.slug === "string" ? params.slug : "";
  const cleanSlug = rawSlug.split("?")[0] || "";
  const { isLoaded, user } = useUser();

  const [slug, setSlug] = useState<string | null>(cleanSlug || null);
  const [companyId, setCompanyId] = useState<Id<"companies"> | null>(null);
  const [timeZone, setTimeZone] = useState<string>("UTC");

  // Automatically update state if URL param changes
  useEffect(() => {
    if (cleanSlug && cleanSlug !== slug) {
      setSlug(cleanSlug);
    }
  }, [cleanSlug]);

  // Fetch companyId when slug changes
  const companyIdQuery = useQuery(
    api.companies.getCompanyIdBySlug,
    slug ? { slug } : "skip"
  );

  const isCompanyContactComplete =
    companyIdQuery?.data?.isCompanyContactComplete ?? false;
  const isStripeComplete = companyIdQuery?.data?.isStripeComplete ?? false;

  useEffect(() => {
    if (companyIdQuery?.status === "success") {
      setCompanyId(companyIdQuery.data.companyId);
      setTimeZone(companyIdQuery.data.timeZone);
    }
  }, [companyIdQuery]);

  if (slug && (!companyIdQuery || !companyIdQuery || !isLoaded)) {
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
        setSlug,
        companyId,
        timeZone,
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
