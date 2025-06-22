"use client";

import WeekView from "./WeekView";
import MonthView from "./MonthView";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

interface CalendarSwitcherProps {}

export const CalendarSwitcher: React.FC<CalendarSwitcherProps> = ({}) => {
  const { isWeekView } = useMoveFilter();
  if (isWeekView) {
    return <WeekView />;
  }
  return <MonthView />;
};
