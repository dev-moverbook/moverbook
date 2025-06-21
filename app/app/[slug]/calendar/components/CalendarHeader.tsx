"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  label: string;
  onNavigate: (direction: "prev" | "next") => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  label,
  onNavigate,
}) => {
  return (
    <div className="flex items-center justify-between w-full max-w-screen-sm mx-auto mb-4 h-[44px]">
      <button
        onClick={() => onNavigate("prev")}
        className="px-3 py-2 hover:bg-background2 rounded"
      >
        <ChevronLeft className="text-2xl" />
      </button>
      <h3 className="text-xl leading-[18px] font-sans">{label}</h3>
      <button
        onClick={() => onNavigate("next")}
        className="px-3 py-2 hover:bg-background2 rounded"
      >
        <ChevronRight className="text-2xl" />
      </button>
    </div>
  );
};

export default CalendarHeader;
