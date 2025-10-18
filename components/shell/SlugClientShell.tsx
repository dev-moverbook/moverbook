"use client";

import Navbar from "@/components/shared/nav/Navbar";
import Sidebar from "@/components/shared/side/Sidebar";
import { SearchProvider } from "@/contexts/SearchContext";
import MoveSearchDropDown from "@/components/shared/nav/MoveSearchDropDown";
import { useIsMobile } from "@/hooks/utils/useIsMobile";
import { usePathname } from "next/navigation";
import { useSlugContext } from "@/contexts/SlugContext";
import AdminAlert from "@/components/shared/alert/AdminAlert";

export default function SlugClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { slug } = useSlugContext();
  const isMobile = useIsMobile();
  const pathname = usePathname();

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
