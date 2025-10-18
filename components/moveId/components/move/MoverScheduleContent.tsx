"use client";
import CalendarContainer from "@/components/calendar/components/CalendarContainer";
import MoverSelect from "@/components/move/movers/MoverSelect";
import { useMoverCalendar } from "@/contexts/MoverCalendarContext";
import { useSlugContext } from "@/contexts/SlugContext";
import { getWeekdays, shouldDimDateForMonth } from "@/frontendUtils/helper";
import MoverCalendarHeader from "./MoverCalendarHeader";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import WeekdayHeader from "@/components/calendar/components/WeekdayHeader";
import MoverMonthGrid from "./MoverMonthGrid";

const MoverScheduleContent = () => {
  const { selectedDate, today } = useMoverCalendar();

  const { timeZone } = useSlugContext();

  const weekdays = getWeekdays(selectedDate, timeZone);

  return (
    <SectionContainer>
      <MoverSelect />
      <CalendarContainer>
        <MoverCalendarHeader />
        <WeekdayHeader weekdays={weekdays} />
        <MoverMonthGrid
          today={today}
          shouldDimDate={(day) =>
            shouldDimDateForMonth(day, selectedDate, timeZone)
          }
        />
      </CalendarContainer>
    </SectionContainer>
  );
};

export default MoverScheduleContent;
