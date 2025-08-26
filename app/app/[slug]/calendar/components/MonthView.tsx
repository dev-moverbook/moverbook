"use client";

import { DateTime } from "luxon";
import {
  formatMonthYear,
  getMonthGrid,
  shouldDimDateForMonth,
} from "@/app/frontendUtils/helper";
import CalendarHeader from "./CalendarHeader";
import WeekdayHeader from "./WeekdayHeader";
import CalendarMonthGrid from "./CalendarMonthGrid";
import CalendarContainer from "./CalendarContainer";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

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
