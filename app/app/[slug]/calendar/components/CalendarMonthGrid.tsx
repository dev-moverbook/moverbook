"use client";

import React from "react";

interface CalendarMonthGridProps {
  dates: Date[];
  today: Date;
  onDateClick?: (date: Date) => void;
  getDotColor?: (date: Date) => string | null;
  getPriceLabel?: (date: Date) => string | null;
  shouldDimDate?: (date: Date) => boolean;
}

const CalendarMonthGrid: React.FC<CalendarMonthGridProps> = ({
  dates,
  today,
  onDateClick,
  getDotColor,
  getPriceLabel,
  shouldDimDate,
}) => {
  return (
    <div className="flex flex-wrap w-full">
      {dates.map((day) => {
        const isToday = day.toDateString() === today.toDateString();

        const isDimmed = shouldDimDate?.(day) ?? false;

        const dotColor = getDotColor?.(day);
        const price = getPriceLabel?.(day);
        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => onDateClick?.(day)}
            className={`hover:bg-background2 hover:rounded h-16 w-[14.2857%] aspect-square flex items-center justify-center font-medium transition-all overflow-hidden
              ${isDimmed ? "opacity-50" : ""}
              ${isToday ? "z-10" : ""}
            `}
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
                <span className="text-[12px] mt-1 text-grayCustom2 leading-none">
                  {price}
                </span>
              )}
              {dotColor && (
                <div
                  className="mt-[4px] rounded-full w-[6px] h-[6px]"
                  style={{ backgroundColor: dotColor }}
                />
              )}
            </abbr>
          </button>
        );
      })}
    </div>
  );
};

export default CalendarMonthGrid;
