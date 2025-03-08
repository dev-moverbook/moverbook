"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { SlugProvider, useSlugContext } from "@/app/contexts/SlugContext";

const CompanyLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { slug } = useParams();
  const cleanSlug = typeof slug === "string" ? slug.split("?")[0] : "";

  // Get slug context
  const { slug: contextSlug, setSlug } = useSlugContext();

  useEffect(() => {
    if (cleanSlug && cleanSlug !== contextSlug) {
      setSlug(cleanSlug);
    }
  }, [cleanSlug, setSlug, contextSlug]);

  return <div>{children}</div>;
};

const CompanyPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <SlugProvider>
      <CompanyLayout>{children}</CompanyLayout>
    </SlugProvider>
  );
};

export default CompanyPage;
