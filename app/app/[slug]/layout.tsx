"use client";

import React from "react";
import { SlugProvider, useSlugContext } from "@/app/contexts/SlugContext";
import Navbar from "@/app/components/shared/Navbar";
import Sidebar from "@/app/components/shared/Sidebar";
import { SearchProvider } from "@/app/contexts/SearchContext";
import MoveSearchDropDown from "@/app/components/shared/nav/MoveSearchDropDown";
import AdminAlert from "@/app/app/[slug]/ components/AdminAlert";
import { useIsMobile } from "@/app/hooks/utils/useIsMobile";
import { usePathname } from "next/navigation";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { slug } = useSlugContext();
  // Only hide navbar if MOBILE + matches route condition
  const hideNavbar =
    isMobile &&
    (pathname === `/app/${slug}/add-move` ||
      (pathname.includes(`/app/${slug}/moves/`) &&
        pathname.endsWith("/messages")));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        {!hideNavbar && <Navbar />}
        <MoveSearchDropDown />
        <main className={`${hideNavbar ? "pt-2" : "pt-14 "}`}>
          <AdminAlert />
          {children}
        </main>
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
