import CalendarContainer from "@/app/app/[slug]/calendar/components/CalendarContainer";
import MoverSelect from "@/app/components/move/movers/MoverSelect";
import { useMoverCalendar } from "@/app/contexts/MoverCalendarContext";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { getWeekdays, shouldDimDateForMonth } from "@/app/frontendUtils/helper";
import React from "react";
import MoverCalendarHeader from "./MoverCalendarHeader";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import WeekdayHeader from "@/app/app/[slug]/calendar/components/WeekdayHeader";
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
