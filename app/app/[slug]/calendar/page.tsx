"use client";

import React, { useState, useMemo } from "react";
import { DateTime } from "luxon";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { CalendarSwitcher } from "./components/CalendarSwitcher";
import { useMovesForCalendar } from "@/app/hooks/queries/useGetMovesForCalendar";
import { getCurrentDate, navigateDate } from "@/app/frontendUtils/helper";
import ToggleCalendar from "./components/ToggleCalendar";
import PageContainer from "@/app/components/shared/containers/PageContainer";
import MoveCardContainer from "@/app/components/move/MoveCardContainer";

const CalendarPage = () => {
  const { companyId, timeZone } = useSlugContext();

  const [isWeekView, setIsWeekView] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    getCurrentDate(timeZone)
  );

  const [calendarMonthYear, setCalendarMonthYear] = useState(() => {
    const now = DateTime.local().setZone(timeZone);
    return { month: now.month, year: now.year };
  });

  const today = getCurrentDate(timeZone);

  const { startDate, endDate } = useMemo(() => {
    const start = DateTime.fromObject({
      year: calendarMonthYear.year,
      month: calendarMonthYear.month,
      day: 1,
    }).setZone(timeZone);

    const end = start.endOf("month");

    return {
      startDate: start.toISODate() ?? "",
      endDate: end.toISODate() ?? "",
    };
  }, [calendarMonthYear, timeZone]);

  const {
    data: moves,
    isLoading,
    isError,
    errorMessage,
  } = useMovesForCalendar({
    start: startDate,
    end: endDate,
    companyId,
  });

  const { weekStart, weekEnd } = useMemo(() => {
    const selected = DateTime.fromJSDate(selectedDate).setZone(timeZone);
    const start = selected.startOf("week"); // Sunday
    const end = selected.endOf("week"); // Saturday
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

  const moveDatesSet = useMemo(() => {
    return new Set(
      moves.map((move) =>
        DateTime.fromISO(move.moveDate ?? "")
          .setZone(timeZone)
          .toISODate()
      )
    );
  }, [moves, timeZone]);

  const hasEventOnDate = (date: Date) => {
    const isoDate = DateTime.fromJSDate(date).setZone(timeZone).toISODate();
    return moveDatesSet.has(isoDate);
  };

  const handleNavigation = (direction: "prev" | "next") =>
    setSelectedDate(navigateDate(selectedDate, direction, timeZone));

  return (
    <PageContainer>
      <CalendarSwitcher
        isWeekView={isWeekView}
        date={selectedDate}
        onDateClick={setSelectedDate}
        onNavigate={handleNavigation}
        hasEventOnDate={hasEventOnDate}
        handleActiveStartDateChange={() => {}}
        TIME_ZONE={timeZone}
        today={today}
      />
      <ToggleCalendar
        isWeekView={isWeekView}
        onToggle={() => setIsWeekView(!isWeekView)}
      />

      {isLoading && <p>Loading moves...</p>}
      {isError && <p className="text-red-500">{errorMessage}</p>}

      {!isLoading && !isError && (
        <div className="mt-4">
          <h3 className="font-semibold">
            Moves for Week of {weekStart} - {weekEnd}
          </h3>
          <MoveCardContainer moves={weeklyMoves} />
        </div>
      )}
    </PageContainer>
  );
};

export default CalendarPage;
