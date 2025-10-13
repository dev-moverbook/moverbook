"use client";

import { isMover } from "@/app/frontendUtils/permissions";
import { useUser } from "@clerk/nextjs";
import { ClerkRoles } from "@/types/enums";
import FilterTags from "./FilterTags";
import CalendarListToggle from "./CalendarListToggle";
import MoverTags from "./MoverTags";

const CalendarNav = () => {
  const { user } = useUser();
  if (!user) return null;
  const isMoverUser = isMover(user.publicMetadata.role as ClerkRoles);

  return (
    <div className="px-4 md:px-0">
      <div className="flex items-start gap-2 w-full">
        {isMoverUser ? <MoverTags /> : <FilterTags />}

        <CalendarListToggle />
      </div>
    </div>
  );
};

export default CalendarNav;
