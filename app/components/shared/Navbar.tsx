"use client";

import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { Calendar, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
import SearchInput from "./SearchInput";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { canCreateMove, isMover } from "@/app/frontendUtils/permissions";
import { ClerkRoles } from "@/types/enums";

const Navbar = () => {
  const { slug, isCompanyContactComplete, isStripeComplete, user } =
    useSlugContext();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const userRole = user.publicMetadata.role as ClerkRoles;
  const canCreateMoveUser = canCreateMove(userRole);
  const moverUser = isMover(userRole);

  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  const handleAddMove = () => {
    if (!isAddMoveDisabled) {
      router.push(`/app/${slug}/add-move`);
    }
  };

  const handleViewCalendar = () => {
    router.push(`/app/${slug}/calendar`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-black flex items-center px-2 z-40 shadow-md border-grayCustom">
      {/* Mobile Hamburger */}
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
            <SidebarContent onNavigate={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Search */}
      <div className="flex-1 lg:ml-64">
        <div className="flex items-center justify-between px-1">
          <SearchInput />
        </div>
      </div>

      {canCreateMoveUser ? (
        <IconButton
          icon={<FiPlusCircle className="text-2xl" />}
          variant="ghost"
          title="Add Move"
          disabled={isAddMoveDisabled}
          onClick={handleAddMove}
          className="cursor-pointer"
        />
      ) : moverUser ? (
        <IconButton
          icon={<Calendar className="text-2xl" />}
          variant="ghost"
          title="View Calendar"
          onClick={handleViewCalendar}
          className="cursor-pointer"
        />
      ) : null}
    </nav>
  );
};

export default Navbar;
