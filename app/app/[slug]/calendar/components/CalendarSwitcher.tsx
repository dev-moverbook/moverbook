"use client";

import Calendar from "react-calendar";
import { CalendarValue } from "@/types/types";
import { formatNarrowWeekday } from "@/app/frontendUtils/helper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WeekView from "./WeekView";

interface CalendarSwitcherProps {
  isWeekView: boolean;
  date: Date;
  today: Date;
  onDateClick: (value: Date) => void;
  onNavigate: (direction: "prev" | "next") => void;
  hasEventOnDate: (date: Date) => boolean;
  handleActiveStartDateChange: (date: Date | null) => void;
  TIME_ZONE: string;
}

export const CalendarSwitcher: React.FC<CalendarSwitcherProps> = ({
  isWeekView,
  date,
  today,
  onDateClick,
  onNavigate,
  hasEventOnDate,
  handleActiveStartDateChange,
  TIME_ZONE,
}) => {
  if (isWeekView) {
    return (
      <WeekView
        date={date}
        today={today}
        onDateClick={onDateClick}
        onNavigate={onNavigate}
        hasEventOnDate={hasEventOnDate}
        TIME_ZONE={TIME_ZONE}
      />
    );
  }

  return (
    <div className="w-full">
      <Calendar
        onChange={(val) => {
          if (val instanceof Date) onDateClick(val);
        }}
        value={date}
        calendarType="gregory"
        className="px-2 pt-3 w-full"
        next2Label={null}
        prev2Label={null}
        nextLabel={<ChevronRight className="text-xl" />}
        prevLabel={<ChevronLeft className="text-xl" />}
        formatShortWeekday={formatNarrowWeekday}
        selectRange={false}
        tileContent={({ date: tileDate, view }) => {
          if (view === "month") {
            const isToday = tileDate.toDateString() === today.toDateString();
            const hasEvent = hasEventOnDate(tileDate);
            return (
              <div className="relative">
                {isToday && (
                  <div className="absolute w-6 h-6 mt-[-38px] ml-[-10px] mr-6 bg-primaryBlue rounded-full">
                    <p className="text-base">{tileDate.getDate()}</p>
                  </div>
                )}
                {hasEvent && (
                  <div
                    className={`absolute bottom-1 transform 
                    ${isToday ? "-translate-x-[15%]" : "-translate-x-1/2"} 
                    bg-greenCustom rounded-full w-1.5 h-1.5`}
                  />
                )}
              </div>
            );
          }
          return null;
        }}
        onActiveStartDateChange={({ activeStartDate }) =>
          handleActiveStartDateChange(activeStartDate)
        }
      />
    </div>
  );
};
