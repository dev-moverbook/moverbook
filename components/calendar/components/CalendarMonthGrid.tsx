"use client";

import { useMoveFilter } from "@/contexts/MoveFilterContext";
import { useSlugContext } from "@/contexts/SlugContext";
import { formatCurrencyCompact } from "@/frontendUtils/helper";
import { isMover } from "@/frontendUtils/permissions";
import {
  toISODateInZone,
  movesOnISODate,
  computeMoveStatusesForDay,
  computeDailyTotal,
} from "@/frontendUtils/helper";
import DayCell from "./DayCell";

interface CalendarMonthGridProps {
  dates: Date[];
  today: Date;
  shouldDimDate: (date: Date) => boolean;
}

const CalendarMonthGrid = ({
  dates,
  today,
  shouldDimDate,
}: CalendarMonthGridProps) => {
  const {
    isWeekView,
    setSelectedDate,
    setIsWeekView,
    moves,
    selectedStatuses,
  } = useMoveFilter();
  const { timeZone, user } = useSlugContext();

  const isMoverUser = isMover(user?.role);

  const handleDateClick = (date: Date) => {
    if (!isWeekView) {
      setSelectedDate(date);
      setIsWeekView(true);
    }
  };

  return (
    <div className="flex flex-wrap w-full">
      {dates.map((day) => {
        const isToday = day.toDateString() === today.toDateString();
        const isDimmed = shouldDimDate?.(day) ?? false;
        const isoDate = toISODateInZone(day, timeZone);
        const movesOnDate = movesOnISODate(moves, isoDate, timeZone);
        const moveStatuses = computeMoveStatusesForDay(
          movesOnDate,
          isMoverUser
        );
        const dailyTotal = computeDailyTotal(
          movesOnDate,
          isMoverUser,
          selectedStatuses
        );
        const price = dailyTotal > 0 ? formatCurrencyCompact(dailyTotal) : null;

        return (
          <DayCell
            key={day.toISOString()}
            day={day}
            isToday={isToday}
            isDimmed={isDimmed}
            isWeekView={isWeekView}
            price={price}
            moveStatuses={moveStatuses}
            onClick={handleDateClick}
          />
        );
      })}
    </div>
  );
};

export default CalendarMonthGrid;
