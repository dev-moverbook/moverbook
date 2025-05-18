"use client";

import SidebarContent from "./SidebarContent";
import type { UserResource } from "@clerk/types";

type SidebarProps = {
  slug: string;
  user?: UserResource | null;
};

const Sidebar = ({ slug, user }: SidebarProps) => {
  return (
    <aside className="hidden lg:block w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 z-50 overflow-y-auto">
      <SidebarContent slug={slug} user={user} />
    </aside>
  );
};

export default Sidebar;
