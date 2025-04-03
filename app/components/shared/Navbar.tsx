"use client";

import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "./SidebarContent";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-black flex items-center px-4 z-40 shadow-md border-b border-grayCustom ">
      {/* Hamburger only on mobile */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="text-white hover:bg-gray-800 rounded-md p-1 transition">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </SheetTrigger>

          {/* Sidebar overlays everything */}
          <SheetContent
            side="left"
            className="h-screen w-full max-w-full p-0 bg-gray-900 text-white overflow-y-auto z-[999]"
          >
            <SidebarContent onNavigate={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Center: Search */}
      <div className="flex-1 px-4 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search Customer"
          className="text-sm w-full bg-transparent border border-grayCustom text-white placeholder-grayCustom rounded-custom px-4 py-1 focus:outline-none focus:ring focus:ring-grayCustom"
        />
      </div>

      {/* Right: Plus Icon */}
      <button className="text-white hover:bg-gray-800 rounded-full p-1 transition">
        <FiPlusCircle className="text-2xl" />
      </button>
    </nav>
  );
};

export default Navbar;
