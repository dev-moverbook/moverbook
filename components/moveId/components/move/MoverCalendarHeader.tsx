"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useSlugContext } from "@/contexts/SlugContext";
import { useMoverCalendar } from "@/contexts/MoverCalendarContext";
import IconButton from "@/components/shared/buttons/IconButton";
import { formatMonthYear } from "@/frontendUtils/helper";

const MoverCalendarHeader: React.FC = () => {
  const { selectedDate, setSelectedDate } = useMoverCalendar();
  const { timeZone } = useSlugContext();

  const handleNavigation = (direction: "prev" | "next") => {
    const current = DateTime.fromJSDate(selectedDate).setZone(timeZone);
    const newDate =
      direction === "next"
        ? current.plus({ months: 1 })
        : current.minus({ months: 1 });
    setSelectedDate(newDate.toJSDate());
  };

  const label = formatMonthYear(selectedDate, timeZone);

  return (
    <div className="flex items-center justify-between w-full max-w-screen-sm mx-auto mb-4 h-[44px]">
      <IconButton
        onClick={() => handleNavigation("prev")}
        className="border-none"
        icon={<ChevronLeft className="text-2xl" />}
        title="Previous"
      />
      <h3 className="text-xl leading-[18px] font-sans">{label}</h3>
      <IconButton
        onClick={() => handleNavigation("next")}
        className="border-none"
        icon={<ChevronRight className="text-2xl" />}
        title="Next"
      />
    </div>
  );
};

export default MoverCalendarHeader;
