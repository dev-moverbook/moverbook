"use client";

import { isMover } from "@/frontendUtils/permissions";
import FilterTags from "./FilterTags";
import CalendarListToggle from "./CalendarListToggle";
import MoverTags from "./MoverTags";
import { useSlugContext } from "@/contexts/SlugContext";

const CalendarNav = () => {
  const { user } = useSlugContext();
  const isMoverUser = isMover(user?.role);

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
