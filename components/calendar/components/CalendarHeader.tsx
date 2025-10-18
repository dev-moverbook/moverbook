"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useMoveFilter } from "@/contexts/MoveFilterContext";
import { useSlugContext } from "@/contexts/SlugContext";
import IconButton from "@/components/shared/IconButton";

interface CalendarHeaderProps {
  label: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ label }) => {
  const { selectedDate, isWeekView, setSelectedDate } = useMoveFilter();
  const { timeZone } = useSlugContext();
  const handleNavigation = (direction: "prev" | "next") => {
    const current = DateTime.fromJSDate(selectedDate).setZone(timeZone);

    const newDate = isWeekView
      ? current.plus({ weeks: direction === "next" ? 1 : -1 })
      : current.plus({ months: direction === "next" ? 1 : -1 });

    setSelectedDate(newDate.toJSDate());
  };

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

export default CalendarHeader;
