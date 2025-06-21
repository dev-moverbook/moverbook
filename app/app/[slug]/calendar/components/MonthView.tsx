"use client";

import { DateTime } from "luxon";
import { formatMonthYear } from "@/app/frontendUtils/helper";
import CalendarHeader from "./CalendarHeader";
import WeekdayHeader from "./WeekdayHeader";
import CalendarMonthGrid from "./CalendarMonthGrid";
import CalendarContainer from "./CalendarContainer";

interface MonthViewProps {
  date: Date;
  today: Date;
  onDateClick: (value: Date) => void;
  onNavigate: (direction: "prev" | "next") => void;
  TIME_ZONE: string;
  getEventDotColor: (date: Date) => string | null;
  getTotalPriceForDate?: (date: Date) => string | null;
}

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

const MonthView: React.FC<MonthViewProps> = ({
  date,
  today,
  onDateClick,
  onNavigate,

  TIME_ZONE,
  getEventDotColor,
  getTotalPriceForDate,
}) => {
  const monthDates = getMonthGrid(date, TIME_ZONE);

  // Get weekday headers, starting from the first day of the week in current locale/timezone
  const weekStart = DateTime.fromJSDate(date)
    .setZone(TIME_ZONE)
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
      <CalendarHeader
        label={formatMonthYear(date, TIME_ZONE)}
        onNavigate={onNavigate}
      />

      <WeekdayHeader weekdays={weekdays} />

      <CalendarMonthGrid
        dates={monthDates}
        today={today}
        onDateClick={onDateClick}
        getDotColor={getEventDotColor}
        getPriceLabel={getTotalPriceForDate}
        shouldDimDate={(day) => shouldDimDateForMonth(day, date, TIME_ZONE)}
      />
    </CalendarContainer>
  );
};

export default MonthView;
