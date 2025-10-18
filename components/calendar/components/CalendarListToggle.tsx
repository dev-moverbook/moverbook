"use client";

import { Calendar, List } from "lucide-react";
import IconButton from "@/components/shared/buttons/IconButton";
import { cn } from "@/lib/utils";
import { useMoveFilter } from "@/contexts/MoveFilterContext";

const CalendarListToggle = () => {
  const { isList, setIsList } = useMoveFilter();
  return (
    <div className="flex gap-2 shrink-0 ml-auto">
      <IconButton
        icon={<Calendar className="w-4 h-4" />}
        onClick={() => setIsList(false)}
        title="Calendar"
        className={cn(
          "w-8 h-8 border border-grayCustom rounded-full flex items-center justify-center",
          !isList &&
            "bg-greenCustom border-greenCustom hover:bg-greenCustom/80 "
        )}
      />
      <IconButton
        icon={<List className="w-4 h-4" />}
        onClick={() => setIsList(true)}
        title="List"
        className={cn(
          "w-8 h-8 border border-grayCustom rounded-full flex items-center justify-center",
          isList &&
            "bg-greenCustom border-greenCustom  hover:bg-greenCustom/80 "
        )}
      />
    </div>
  );
};

export default CalendarListToggle;
