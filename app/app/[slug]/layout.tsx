"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  SlugProvider,
  SET_SLUG,
  useSlugContext,
} from "@/app/contexts/SlugContext";

const CompanyLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { slug } = useParams();
  const cleanSlug = typeof slug === "string" ? slug.split("?")[0] : "";

  // Use a local context dispatch if needed; the provider handles passing the value down.
  const { state, dispatch } = useSlugContext();

  useEffect(() => {
    if (cleanSlug && cleanSlug !== state.slug) {
      dispatch({ type: SET_SLUG, payload: cleanSlug });
    }
  }, [cleanSlug, dispatch, state.slug]);

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
