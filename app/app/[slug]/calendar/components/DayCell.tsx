// components/calendar/DayCell.tsx
"use client";

import React from "react";

interface DayCellProps {
  day: Date;
  isToday: boolean;
  isDimmed: boolean;
  isWeekView: boolean;
  price: string | null;
  moveStatuses: string[];
  onClick: (date: Date) => void;
}

const DayCell = ({
  day,
  isToday,
  isDimmed,
  isWeekView,
  price,
  moveStatuses,
  onClick,
}: DayCellProps) => {
  const baseClass =
    "h-16 w-[14.2857%] aspect-square flex items-center justify-center font-medium transition-all overflow-hidden";
  const hoverClass = !isWeekView ? "hover:bg-background2 hover:rounded" : "";
  const todayClass = isToday ? "z-10" : "";
  const dimmedClass = isDimmed ? "opacity-50" : "";

  return (
    <button
      type="button"
      onClick={() => onClick(day)}
      className={`${baseClass} ${hoverClass} ${todayClass} ${dimmedClass}`}
      disabled={isWeekView}
    >
      <abbr
        aria-label={day.toDateString()}
        className="relative font-medium flex flex-col items-center justify-start h-full pt-2"
      >
        {isToday && (
          <div className="absolute w-[26px] h-[26px] bg-background2 rounded-full top-1 z-0" />
        )}
        <span className="relative z-10 text-sm">{day.getDate()}</span>
        {price && (
          <span className="text-[10px] mt-1 text-grayCustom2 leading-none">
            {price}
          </span>
        )}
        {moveStatuses.length > 0 && (
          <div className="mt-[4px] flex justify-center overflow-visible">
            <div className="flex items-center max-w-[28px] overflow-visible relative">
              {moveStatuses.map((color, idx) => (
                <div
                  key={`${day.toISOString()}-${idx}`}
                  className="rounded-full w-[6px] h-[6px] flex-shrink-0"
                  style={{
                    backgroundColor: color,
                    marginRight: moveStatuses.length > 1 ? "-2px" : "0px",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </abbr>
    </button>
  );
};

export default DayCell;
