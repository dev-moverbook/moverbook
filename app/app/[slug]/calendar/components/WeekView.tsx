import { DateTime } from "luxon";
import { formatMonthYear } from "@/app/frontendUtils/helper";
import CalendarHeader from "./CalendarHeader";
import WeekdayHeader from "./WeekdayHeader";
import CalendarMonthGrid from "./CalendarMonthGrid";
import CalendarContainer from "./CalendarContainer";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

const WeekView = () => {
  const { timeZone } = useSlugContext();
  const { today, selectedDate } = useMoveFilter();

  const getMajorityMonth = (weekDates: Date[], timeZone: string): Date => {
    const monthCount: Record<number, number> = {};
    for (const date of weekDates) {
      const month = DateTime.fromJSDate(date).setZone(timeZone).month;
      monthCount[month] = (monthCount[month] || 0) + 1;
    }
    // Sort months by count descending
    const sortedMonths = Object.entries(monthCount).sort((a, b) => b[1] - a[1]);
    const majorityMonth = Number(sortedMonths[0][0]);
    const majorityDate = weekDates.find(
      (d) => DateTime.fromJSDate(d).setZone(timeZone).month === majorityMonth
    );
    return majorityDate ?? weekDates[0];
  };

  const getWeekDates = (currentDate: Date) => {
    const startOfWeek = DateTime.fromJSDate(currentDate)
      .setZone(timeZone)
      .startOf("week");

    return Array.from({ length: 7 }, (_, i) =>
      startOfWeek.plus({ days: i }).toJSDate()
    );
  };

  const weekDates = getWeekDates(selectedDate);

  const majorityMonth = getMajorityMonth(weekDates, timeZone);

  return (
    <CalendarContainer>
      <CalendarHeader label={formatMonthYear(majorityMonth, timeZone)} />

      <WeekdayHeader weekdays={weekDates} />

      <CalendarMonthGrid dates={weekDates} today={today} />
    </CalendarContainer>
  );
};

export default WeekView;
