import { DateTime } from "luxon";
import { formatMonthYear } from "@/app/frontendUtils/helper";
import CalendarHeader from "./CalendarHeader";
import WeekdayHeader from "./WeekdayHeader";
import CalendarMonthGrid from "./CalendarMonthGrid";
import CalendarContainer from "./CalendarContainer";

interface WeekViewProps {
  date: Date;
  today: Date;
  onNavigate: (direction: "prev" | "next") => void;
  TIME_ZONE: string;
  getEventDotColor: (date: Date) => string | null;
  getTotalPriceForDate?: (date: Date) => string | null;
}

const WeekView: React.FC<WeekViewProps> = ({
  date,
  today,
  onNavigate,
  TIME_ZONE,
  getEventDotColor,
  getTotalPriceForDate,
}) => {
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
      .setZone(TIME_ZONE)
      .startOf("week");

    return Array.from({ length: 7 }, (_, i) =>
      startOfWeek.plus({ days: i }).toJSDate()
    );
  };

  const weekDates = getWeekDates(date);

  const majorityMonth = getMajorityMonth(weekDates, TIME_ZONE);

  return (
    <CalendarContainer>
      <CalendarHeader
        label={formatMonthYear(majorityMonth, TIME_ZONE)}
        onNavigate={onNavigate}
      />

      <WeekdayHeader weekdays={weekDates} />

      <CalendarMonthGrid
        dates={weekDates}
        today={today}
        getDotColor={getEventDotColor}
        getPriceLabel={getTotalPriceForDate}
      />
    </CalendarContainer>
  );
};

export default WeekView;
