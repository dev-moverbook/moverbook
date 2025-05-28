// "use client";
// import React, { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { SlugProvider, useSlugContext } from "@/app/contexts/SlugContext";
// import Navbar from "@/app/components/shared/Navbar";
// import Sidebar from "@/app/components/shared/Sidebar";
// import { useUser } from "@clerk/nextjs";
// const CompanyLayout: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { slug } = useParams();
//   const cleanSlug = typeof slug === "string" ? slug.split("?")[0] : "";
//   const { user } = useUser();

//   // Get slug context
//   const { slug: contextSlug, setSlug } = useSlugContext();

//   useEffect(() => {
//     if (cleanSlug && cleanSlug !== contextSlug) {
//       setSlug(cleanSlug);
//     }
//   }, [cleanSlug, setSlug, contextSlug]);

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar slug={cleanSlug} user={user} />
//       <div className="flex-1 lg:ml-64">
//         {" "}
//         <Navbar slug={cleanSlug} user={user} />
//         <main className="pt-14 bg-black">{children}</main>{" "}
//       </div>
//     </div>
//   );
// };

// const CompanyPage = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <SlugProvider>
//       <CompanyLayout>{children}</CompanyLayout>
//     </SlugProvider>
//   );
// };

// export default CompanyPage;

// "use client";

// import React, { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { SlugProvider, useSlugContext } from "@/app/contexts/SlugContext";
// import Navbar from "@/app/components/shared/Navbar";
// import Sidebar from "@/app/components/shared/Sidebar";
// import { useUser } from "@clerk/nextjs";

// interface CompanyLayoutProps {
//   children: React.ReactNode;
//   hideNavbar?: boolean;
// }

// const CompanyLayout: React.FC<CompanyLayoutProps> = ({
//   children,
//   hideNavbar = false,
// }) => {
//   const { slug } = useParams();
//   const cleanSlug = typeof slug === "string" ? slug.split("?")[0] : "";
//   const { user } = useUser();

//   const { slug: contextSlug, setSlug } = useSlugContext();

//   useEffect(() => {
//     if (cleanSlug && cleanSlug !== contextSlug) {
//       setSlug(cleanSlug);
//     }
//   }, [cleanSlug, setSlug, contextSlug]);

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar slug={cleanSlug} user={user} />
//       <div className="flex-1 lg:ml-64">
//         {!hideNavbar && (
//           <Navbar slug={cleanSlug} user={user} hideSearchActions={hideNavbar} />
//         )}
//         <main className={`${!hideNavbar ? "pt-14" : ""} bg-black`}>
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// interface CompanyPageProps {
//   children: React.ReactNode;
//   hideNavbar?: boolean;
// }

// const CompanyPage: React.FC<CompanyPageProps> = ({
//   children,
//   hideNavbar = false,
// }) => {
//   return (
//     <SlugProvider>
//       <CompanyLayout hideNavbar={hideNavbar}>{children}</CompanyLayout>
//     </SlugProvider>
//   );
// };

// export default CompanyPage;

"use client";

import React, { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { SlugProvider, useSlugContext } from "@/app/contexts/SlugContext";
import Navbar from "@/app/components/shared/Navbar";
import Sidebar from "@/app/components/shared/Sidebar";
import { useUser } from "@clerk/nextjs";

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
  const HIDE_NAVBAR_ROUTES = [`/app/${cleanSlug}/add-move`];
  const hideNavbar = HIDE_NAVBAR_ROUTES.includes(pathname);
  return (
    <div className="flex min-h-screen">
      <Sidebar slug={cleanSlug} user={user} />
      <div className={`flex-1  lg:ml-64 ${hideNavbar ? "" : ""} `}>
        {!hideNavbar && <Navbar slug={cleanSlug} user={user} />}{" "}
        <main className={`${hideNavbar ? "pt-4" : "pt-14"} `}>{children}</main>
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
      <CompanyLayout>{children}</CompanyLayout>
    </SlugProvider>
  );
};

export default CompanyPage;
