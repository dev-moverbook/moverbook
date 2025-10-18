"use client";

import React from "react";
import { DateTime } from "luxon";
import { useSlugContext } from "@/contexts/SlugContext";
import { useMoverCalendar } from "@/contexts/MoverCalendarContext";
import { getMonthGrid } from "@/frontendUtils/helper";
import { getStatusColor } from "@/frontendUtils/helper"; // import your helper

type Props = {
  today: Date;
  shouldDimDate?: (date: Date) => boolean;
};

export default function MoverMonthGrid({ today, shouldDimDate }: Props) {
  const { moves, selectedDate, setSelectedDate } = useMoverCalendar();
  const { timeZone } = useSlugContext();

  const dates = getMonthGrid(selectedDate, timeZone);
  return (
    <div className="flex flex-wrap w-full">
      {dates.map((day) => {
        const isToday = day.toDateString() === today.toDateString();
        const isDimmed = shouldDimDate?.(day) ?? false;
        const isoDate = DateTime.fromJSDate(day).setZone(timeZone).toISODate();

        const movesOnDate = moves.filter((move) => {
          const moveDate = DateTime.fromISO(move.moveDate ?? "")
            .setZone(timeZone)
            .toISODate();
          return moveDate === isoDate;
        });

        const colors = movesOnDate
          .map((m) => getStatusColor(m.moveWindow))
          .filter(Boolean);

        const baseClass =
          "h-16 w-[14.2857%] aspect-square flex items-center justify-center font-medium transition-all overflow-hidden";
        const hoverClass = "hover:bg-background2 hover:rounded";
        const todayClass = isToday ? "z-10" : "";
        const dimmedClass = isDimmed ? "opacity-50" : "";

        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => setSelectedDate(day)}
            className={`${baseClass} ${hoverClass} ${todayClass} ${dimmedClass}`}
          >
            <abbr
              aria-label={day.toDateString()}
              className="relative font-medium flex flex-col items-center justify-start h-full pt-2"
            >
              {isToday && (
                <div className="absolute w-[26px] h-[26px] bg-background2 rounded-full top-1 z-0" />
              )}
              <span className="relative z-10 text-sm">{day.getDate()}</span>

              {colors.length > 0 && (
                <div className="mt-[4px] flex justify-center overflow-visible">
                  <div className="flex items-center max-w-[28px] overflow-visible relative">
                    {colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="rounded-full w-[6px] h-[6px] flex-shrink-0"
                        style={{
                          backgroundColor: color,
                          marginRight: colors.length > 1 ? "-2px" : "0px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </abbr>
          </button>
        );
      })}
    </div>
  );
}
