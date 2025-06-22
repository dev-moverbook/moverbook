"use client";

import React, { useState, useMemo } from "react";
import { DateTime } from "luxon";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { CalendarSwitcher } from "./components/CalendarSwitcher";
import ToggleCalendar from "./components/ToggleCalendar";
import PageContainer from "@/app/components/shared/containers/PageContainer";
import MoveCardContainer from "@/app/components/move/MoveCardContainer";
import CalendarNav from "./components/CalendarNav";
import {
  MoveFilterProvider,
  useMoveFilter,
} from "@/app/contexts/MoveFilterContext";
import DateRangeFields from "./components/DateRangerPiker";

const CalendarPage = () => {
  return (
    <MoveFilterProvider>
      <CalendarPageContent />
    </MoveFilterProvider>
  );
};

const CalendarPageContent = () => {
  const { timeZone } = useSlugContext();

  const {
    isList,
    moves,
    isLoading,
    isError,
    errorMessage,
    selectedDate,
    isWeekView,
  } = useMoveFilter();

  const { weekStart, weekEnd } = useMemo(() => {
    const selected = DateTime.fromJSDate(selectedDate).setZone(timeZone);

    const start = selected.startOf("week"); // Sunday
    const end = start.plus({ days: 6 }).endOf("day"); // Saturday

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
        <DateRangeFields />
      ) : (
        <>
          <CalendarSwitcher />
          <ToggleCalendar />
        </>
      )}

      {/* {isLoading && <p>Loading moves...</p>} */}
      {isError && <p className="text-red-500">{errorMessage}</p>}

      {!isLoading && !isError && isWeekView && (
        <MoveCardContainer moves={weeklyMoves} />
      )}
    </PageContainer>
  );
};

export default CalendarPage;
