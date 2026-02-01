"use client";

import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import IconButton from "@/components/shared/buttons/IconButton";
import { useSlugContext } from "@/contexts/SlugContext";
import Link from "next/link"; 

const PublicMoveNav = () => {
  const { move } = usePublicMoveIdContext();
  const { user } = useSlugContext();

  const showBackButton = !!user;
  const companyName = move.company.name;
  const adminPath = `/admin/${move.company.slug}`;

  return (
    <nav className="fixed top-0 left-0 w-full h-10 bg-black flex items-center px-4 z-40 shadow-light-md border-grayCustom">
      <div className="flex-shrink-0 w-10"> 
        {showBackButton && (
          <IconButton
            asChild 
            icon={<ArrowLeft size={20} />}
            variant="ghost"
            title="Back to Admin"
          >
            <Link href={adminPath} />
          </IconButton>
        )}
      </div>

      <div className="flex-1 flex justify-center overflow-hidden">
        <p className="text-white font-bold truncate px-4">
          {companyName}
        </p>
      </div>

      <div className="flex-shrink-0 w-10 flex justify-end">
        <UserButton />
      </div>
    </nav>
  );
};

export default PublicMoveNav;