"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import { useMoveFilter } from "@/contexts/MoveFilterContext";
import {
  formatMonthYear,
  getMajorityMonth,
  getWeekdays,
  shouldDimDateForMonth,
} from "@/frontendUtils/helper";
import CalendarHeader from "./CalendarHeader";
import WeekdayHeader from "./WeekdayHeader";
import CalendarMonthGrid from "./CalendarMonthGrid";
import CalendarContainer from "./CalendarContainer";

const WeekView = () => {
  const { timeZone } = useSlugContext();
  const { today, selectedDate } = useMoveFilter();

  const weekdays = getWeekdays(selectedDate, timeZone);
  const majorityMonth = getMajorityMonth(weekdays, timeZone);

  const shouldDimDate = (date: Date) =>
    shouldDimDateForMonth(date, majorityMonth, timeZone);

  return (
    <CalendarContainer>
      <CalendarHeader label={formatMonthYear(majorityMonth, timeZone)} />
      <WeekdayHeader weekdays={weekdays} />
      <CalendarMonthGrid
        dates={weekdays}
        today={today}
        shouldDimDate={shouldDimDate}
      />
    </CalendarContainer>
  );
};

export default WeekView;
