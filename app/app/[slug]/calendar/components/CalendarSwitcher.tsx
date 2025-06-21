"use client";

import WeekView from "./WeekView";
import MonthView from "./MonthView";

interface CalendarSwitcherProps {
  isWeekView: boolean;
  date: Date;
  today: Date;
  onDateClick: (value: Date) => void;
  onNavigate: (direction: "prev" | "next") => void;
  TIME_ZONE: string;
  getEventDotColor: (date: Date) => string | null;
  getTotalPriceForDate?: (date: Date) => string | null;
}

export const CalendarSwitcher: React.FC<CalendarSwitcherProps> = ({
  isWeekView,
  date,
  today,
  onDateClick,
  onNavigate,
  getEventDotColor,
  TIME_ZONE,
  getTotalPriceForDate,
}) => {
  if (isWeekView) {
    return (
      <WeekView
        date={date}
        today={today}
        onNavigate={onNavigate}
        TIME_ZONE={TIME_ZONE}
        getEventDotColor={getEventDotColor}
        getTotalPriceForDate={getTotalPriceForDate}
      />
    );
  }
  return (
    <MonthView
      date={date}
      today={today}
      onDateClick={onDateClick}
      onNavigate={onNavigate}
      TIME_ZONE={TIME_ZONE}
      getEventDotColor={getEventDotColor}
      getTotalPriceForDate={getTotalPriceForDate}
    />
  );
};
