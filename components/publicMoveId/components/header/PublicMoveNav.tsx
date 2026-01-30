"use client";

import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import IconButton from "@/components/shared/buttons/IconButton";
import { useRouter } from "next/navigation";

const PublicMoveNav = () => {
  const { userRole, move } = usePublicMoveIdContext();

  const showBackButton = !!userRole;

  const companyName = move.company.name;
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/admin/${move.company.slug}`);
    }
  };

  return (
    <nav className=" fixed top-0 left-0 w-full h-10 bg-black flex items-center px-4 z-40 shadow-light-md border-grayCustom">
      <div className="flex-shrink-0">
        {showBackButton && (
          <IconButton
            icon={<ArrowLeft size={20} />}
            variant="ghost"
            title="Back"
            onClick={handleBack}
          />
        )}
      </div>

      <div className="flex-1 flex justify-center">
        <p className="text-white font-bold truncate max-w-full px-4">
          {companyName}
        </p>
      </div>

      <div className="flex-shrink-0">
        <UserButton />
      </div>
    </nav>
  );
};

export default PublicMoveNav;
