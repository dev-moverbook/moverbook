"use client";

import React, { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { SlugProvider, useSlugContext } from "@/app/contexts/SlugContext";
import Navbar from "@/app/components/shared/Navbar";
import Sidebar from "@/app/components/shared/Sidebar";
import { useUser } from "@clerk/nextjs";
import { SearchProvider } from "@/app/contexts/SearchContext";
import MoveSearchDropDown from "@/app/components/shared/nav/MoveSearchDropDown";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  const { slug } = useParams();
  const cleanSlug = typeof slug === "string" ? slug.split("?")[0] : "";
  const { user } = useUser();
  const pathname = usePathname();

  const { slug: contextSlug, setSlug } = useSlugContext();

  useEffect(() => {
    if (cleanSlug && cleanSlug !== contextSlug) {
      setSlug(cleanSlug);
    }
  }, [cleanSlug, setSlug, contextSlug]);
  const hideNavbar =
    pathname === `/app/${cleanSlug}/add-move` ||
    (pathname.includes(`/app/${cleanSlug}/moves/`) &&
      pathname.endsWith("/messages"));

  return (
    <div className="flex min-h-screen">
      <Sidebar slug={cleanSlug} user={user} />
      <div className={`flex-1  lg:ml-64 ${hideNavbar ? "" : ""} `}>
        {!hideNavbar && <Navbar slug={cleanSlug} user={user} />}{" "}
        <MoveSearchDropDown />
        <main className={`${hideNavbar ? "pt-2" : "pt-14"} `}>{children}</main>
      </div>
    </div>
  );
};

interface CompanyPageProps {
  children: React.ReactNode;
}

const CompanyPage: React.FC<CompanyPageProps> = ({ children }) => {
  return (
    <SlugProvider>
      <SearchProvider>
        <CompanyLayout>{children}</CompanyLayout>
      </SearchProvider>
    </SlugProvider>
  );
};

export default CompanyPage;
