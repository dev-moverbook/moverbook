"use client";

import { DateTime } from "luxon";
import { formatMonthYear } from "@/app/frontendUtils/helper";
import CalendarHeader from "./CalendarHeader";
import WeekdayHeader from "./WeekdayHeader";
import CalendarMonthGrid from "./CalendarMonthGrid";
import CalendarContainer from "./CalendarContainer";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

const getMonthGrid = (viewDate: Date, timeZone: string) => {
  const month = DateTime.fromJSDate(viewDate).setZone(timeZone).month;
  const start = DateTime.fromJSDate(viewDate)
    .setZone(timeZone)
    .startOf("month")
    .startOf("week");

  const allDates = Array.from({ length: 42 }, (_, i) =>
    start.plus({ days: i }).toJSDate()
  );

  // Chunk into weeks
  const weeks = Array.from({ length: 6 }, (_, i) =>
    allDates.slice(i * 7, i * 7 + 7)
  );

  // Trim trailing weeks where all dates are outside the target month
  const trimmedWeeks = weeks.filter((week) =>
    week.some(
      (date) => DateTime.fromJSDate(date).setZone(timeZone).month === month
    )
  );

  return trimmedWeeks.flat();
};

const MonthView = () => {
  const { timeZone } = useSlugContext();
  const { today, selectedDate } = useMoveFilter();
  const monthDates = getMonthGrid(selectedDate, timeZone);

  // Get weekday headers, starting from the first day of the week in current locale/timezone
  const weekStart = DateTime.fromJSDate(selectedDate)
    .setZone(timeZone)
    .startOf("week");
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekStart.plus({ days: i }).toJSDate()
  );

  const shouldDimDateForMonth = (
    day: Date,
    reference: Date,
    timeZone: string
  ): boolean => {
    const dayDT = DateTime.fromJSDate(day).setZone(timeZone);
    const refDT = DateTime.fromJSDate(reference).setZone(timeZone);

    return dayDT.month !== refDT.month || dayDT.year !== refDT.year;
  };

  return (
    <CalendarContainer>
      <CalendarHeader label={formatMonthYear(selectedDate, timeZone)} />

      <WeekdayHeader weekdays={weekdays} />

      <CalendarMonthGrid
        dates={monthDates}
        today={today}
        shouldDimDate={(day) =>
          shouldDimDateForMonth(day, selectedDate, timeZone)
        }
      />
    </CalendarContainer>
  );
};

export default MonthView;
