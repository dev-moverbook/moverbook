"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { SlugProvider, useSlugContext } from "@/app/contexts/SlugContext";
import Navbar from "@/app/components/shared/Navbar";
import Sidebar from "@/app/components/shared/Sidebar";

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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

const CompanyPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <SlugProvider>
      <CompanyLayout>{children}</CompanyLayout>
    </SlugProvider>
  );
};

export default CompanyPage;
