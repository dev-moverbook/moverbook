"use client";

import {
  formatMonthYear,
  getMonthGrid,
  getWeekdays,
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
  const weekdays = getWeekdays(selectedDate, timeZone);

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
