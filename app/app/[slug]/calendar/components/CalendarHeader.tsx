"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";
import { useSlugContext } from "@/app/contexts/SlugContext";

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
      <button
        onClick={() => handleNavigation("prev")}
        className="px-3 py-2 hover:bg-background2 rounded"
      >
        <ChevronLeft className="text-2xl" />
      </button>
      <h3 className="text-xl leading-[18px] font-sans">{label}</h3>
      <button
        onClick={() => handleNavigation("next")}
        className="px-3 py-2 hover:bg-background2 rounded"
      >
        <ChevronRight className="text-2xl" />
      </button>
    </div>
  );
};

export default CalendarHeader;
