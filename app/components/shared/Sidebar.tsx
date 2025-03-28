"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "./SidebarContent";
import { Button } from "../ui/button";
import { FiPlusCircle } from "react-icons/fi";

const Sidebar = () => {
  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden absolute top-3 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild className="">
            <button className="text-white hover:bg-gray-800 rounded-md p-1 transition">
              <Menu className="text-white " size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <aside className="hidden lg:block w-64 bg-gray-900 text-white">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
