"use client";

import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { Calendar, Menu, X } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarContent from "../side/SidebarContent";
import IconButton from "../buttons/IconButton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import SearchInput from "../search/SearchInput";
import { useSlugContext } from "@/contexts/SlugContext";
import { canCreateMove, isMover } from "@/frontendUtils/permissions";

const Navbar = () => {
  const { slug, isCompanyContactComplete, isStripeComplete, user } =
    useSlugContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const userRole = user.role;
  const canCreateMoveUser = canCreateMove(userRole);
  const moverUser = isMover(userRole);
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-black flex items-center px-2 z-40 shadow-md border-grayCustom">
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <IconButton
              icon={isOpen ? <X size={24} /> : <Menu size={24} />}
              variant="ghost"
              iconClassName="text-white"
              title={isOpen ? "Close navigation" : "Open navigation"}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
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
              <VisuallyHidden>
                <SheetDescription>
                  Drawer with application navigation links.
                </SheetDescription>
              </VisuallyHidden>
            </SheetHeader>
            <SidebarContent onNavigate={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 lg:ml-64">
        <div className="flex items-center justify-between px-1">
          <SearchInput />
        </div>
      </div>

      {canCreateMoveUser ? (
        <IconButton
          asChild
          variant="ghost"
          title="Add Move"
          disabled={isAddMoveDisabled}
          className={
            isAddMoveDisabled
              ? "opacity-50 pointer-events-none"
              : "cursor-pointer"
          }
        >
          <Link href={`/app/${slug}/add-move`}>
            <FiPlusCircle className="text-2xl" />
            <span className="sr-only">Add Move</span>
          </Link>
        </IconButton>
      ) : moverUser ? (
        <IconButton
          asChild
          variant="ghost"
          title="View Calendar"
          className="cursor-pointer"
        >
          <Link href={`/app/${slug}/calendar`}>
            <Calendar className="text-2xl" />
            <span className="sr-only">View Calendar</span>
          </Link>
        </IconButton>
      ) : null}
    </nav>
  );
};

export default Navbar;
