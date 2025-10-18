"use client";

import React, { useMemo } from "react";
import { DateTime } from "luxon";
import { useSlugContext } from "@/contexts/SlugContext";
import { CalendarSwitcher } from "./components/CalendarSwitcher";
import ToggleCalendar from "./components/ToggleCalendar";
import PageContainer from "@/components/shared/containers/PageContainer";
import MoveCardContainer from "@/components/move/MoveCardContainer";
import CalendarNav from "./components/CalendarNav";
import { useMoveFilter } from "@/contexts/MoveFilterContext";
import DateRangeFieldsWithFilter from "./components/DateRangerPicker";

const CalendarPageContent = () => {
  const { timeZone } = useSlugContext();

  const { isList, moves, isLoading, selectedDate, isWeekView } =
    useMoveFilter();

  const { weekStart, weekEnd } = useMemo(() => {
    const selected = DateTime.fromJSDate(selectedDate).setZone(timeZone);
    const start = selected.startOf("week");
    const end = start.plus({ days: 6 }).endOf("day");

    return {
      weekStart: start.toISODate() ?? "",
      weekEnd: end.toISODate() ?? "",
    };
  }, [selectedDate, timeZone]);

  const weeklyMoves = useMemo(() => {
    return moves.filter((move) => {
      const moveDate = DateTime.fromISO(move.moveDate ?? "").setZone(timeZone);
      return (
        moveDate >= DateTime.fromISO(weekStart) &&
        moveDate <= DateTime.fromISO(weekEnd)
      );
    });
  }, [moves, weekStart, weekEnd, timeZone]);

  return (
    <PageContainer className="gap-2 pb-10">
      <CalendarNav />
      {isList ? (
        <DateRangeFieldsWithFilter />
      ) : (
        <div>
          <CalendarSwitcher />
          <ToggleCalendar />
        </div>
      )}
      {!isLoading && isWeekView && (
        <MoveCardContainer
          moves={weeklyMoves}
          isfilterDates={isList}
          weekStart={weekStart}
          weekEnd={weekEnd}
        />
      )}
    </PageContainer>
  );
};

export default CalendarPageContent;
