"use client";

import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarContent from "./SidebarContent";
import IconButton from "./IconButton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { UserResource } from "@clerk/types";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useRouter } from "next/navigation";

type NavbarProps = {
  slug: string;
  user?: UserResource | null;
};

const Navbar = ({ slug, user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;
  const router = useRouter();

  const handleAddMove = () => {
    if (!isAddMoveDisabled) {
      router.push(`/app/${slug}/add-move`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-black flex items-center px-2 z-40 shadow-md  border-grayCustom">
      {/* Hamburger only on mobile */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <IconButton
              icon={isOpen ? <X size={24} /> : <Menu size={24} />}
              variant="ghost"
              iconClassName="text-white"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="border-none h-screen w-full max-w-full p-0 bg-background2 text-white overflow-y-auto z-[999]"
          >
            <SheetHeader>
              <VisuallyHidden>
                <SheetTitle>Sidebar Navigation</SheetTitle>
              </VisuallyHidden>
            </SheetHeader>
            <SidebarContent
              user={user}
              slug={slug}
              onNavigate={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Centered Search + Plus Button */}
      <div className="flex-1 lg:ml-64">
        <div className="flex items-center justify-between   px-1">
          <SearchInput />
        </div>
      </div>

      <IconButton
        icon={<FiPlusCircle className="text-2xl" />}
        asChild
        variant="ghost"
        title="Add Move"
        disabled={isAddMoveDisabled}
        onClick={handleAddMove}
      >
        <Link href={`/app/${slug}/add-move`} />
      </IconButton>
    </nav>
  );
};

export default Navbar;
