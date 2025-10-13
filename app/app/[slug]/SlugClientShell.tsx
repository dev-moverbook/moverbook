// app/app/[slug]/ClientShell.tsx  (CLIENT)
"use client";

import React from "react";
import Navbar from "@/app/components/shared/Navbar";
import Sidebar from "@/app/components/shared/Sidebar";
import { SearchProvider } from "@/app/contexts/SearchContext";
import MoveSearchDropDown from "@/app/components/shared/nav/MoveSearchDropDown";
import { useIsMobile } from "@/app/hooks/utils/useIsMobile";
import { usePathname } from "next/navigation";
import { useSlugContext } from "@/app/contexts/SlugContext";
import AdminAlert from "./ components/AdminAlert";

export default function SlugClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { slug } = useSlugContext();

  const hideNavbar =
    isMobile &&
    (pathname === `/app/${slug}/add-move` ||
      (pathname.includes(`/app/${slug}/moves/`) &&
        pathname.endsWith("/messages")));

  return (
    <SearchProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          {!hideNavbar && <Navbar />}
          <MoveSearchDropDown />
          <main className={hideNavbar ? "pt-2" : "pt-14"}>
            <AdminAlert />
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
