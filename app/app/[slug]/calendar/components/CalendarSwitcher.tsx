"use client";

import WeekView from "./WeekView";
import MonthView from "./MonthView";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

export const CalendarSwitcher = () => {
  const { isWeekView } = useMoveFilter();
  if (isWeekView) {
    return <WeekView />;
  }
  return <MonthView />;
};
