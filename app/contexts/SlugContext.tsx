"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface SlugContextType {
  slug: string | null;
  setSlug: (slug: string) => void;
  companyId: Id<"companies"> | null;
}

const SlugContext = createContext<SlugContextType | undefined>(undefined);

export const SlugProvider = ({ children }: { children: React.ReactNode }) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<Id<"companies"> | null>(null);

  // Fetch companyId when slug changes
  const companyIdQuery = useQuery(
    api.companies.getCompanyIdBySlug,
    slug ? { slug } : "skip"
  );

  useEffect(() => {
    if (companyIdQuery && companyIdQuery.status === "success") {
      setCompanyId(companyIdQuery.data.companyId);
    }
  }, [companyIdQuery]);

  return (
    <SlugContext.Provider value={{ slug, setSlug, companyId }}>
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
