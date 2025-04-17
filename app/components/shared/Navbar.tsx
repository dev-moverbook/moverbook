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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-black flex items-center px-4 z-40 shadow-md border-b border-grayCustom">
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
            className="h-screen w-full max-w-full p-0 bg-gray-900 text-white overflow-y-auto z-[999]"
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

      {/* Centered Search + Plus Button */}
      <div className="flex-1 lg:ml-64">
        <div className="flex items-center justify-between gap-2 px-4 lg:px-0 mx-auto max-w-2xl">
          <input
            type="text"
            placeholder="Search Customer"
            className="text-sm flex-1 bg-transparent border border-grayCustom text-white placeholder-grayCustom rounded-custom px-4 py-1 focus:outline-none focus:ring focus:ring-grayCustom"
          />
          <IconButton
            icon={<FiPlusCircle className="text-2xl" />}
            variant="ghost"
            iconClassName="text-white"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
