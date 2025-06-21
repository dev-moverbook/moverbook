"use client";

import React, { useState, useMemo } from "react";
import { DateTime } from "luxon";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { CalendarSwitcher } from "./components/CalendarSwitcher";
import { useMovesForCalendar } from "@/app/hooks/queries/useGetMovesForCalendar";
import {
  formatDateToLong,
  getCurrentDate,
  getStatusColor,
} from "@/app/frontendUtils/helper";
import ToggleCalendar from "./components/ToggleCalendar";
import PageContainer from "@/app/components/shared/containers/PageContainer";
import MoveCardContainer from "@/app/components/move/MoveCardContainer";
import CalendarNav from "./components/CalendarNav";
import { MoveStatus } from "@/types/types";
import DateRangeFields from "@/app/components/shared/ui/DateRangerPiker";

const CalendarPage = () => {
  const { companyId, timeZone } = useSlugContext();

  const [isWeekView, setIsWeekView] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    getCurrentDate(timeZone)
  );
  const [selectedStatuses, setSelectedStatuses] = useState<MoveStatus[]>([
    "New Lead",
    "Booked",
  ]);
  const [isList, setIsList] = useState<boolean>(false);
  const [calendarMonthYear, setCalendarMonthYear] = useState(() => {
    const now = DateTime.local().setZone(timeZone);
    return { month: now.month, year: now.year };
  });
  const todayISO = DateTime.local().setZone(timeZone).toISODate()!;
  const weekLaterISO = DateTime.local()
    .setZone(timeZone)
    .plus({ days: 7 })
    .toISODate()!;

  const [filterStartDate, setFilterStartDate] = useState(todayISO);
  const [filterEndDate, setFilterEndDate] = useState(weekLaterISO);

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
    start: isList ? filterStartDate : startDate,
    end: isList ? filterEndDate : endDate,
    companyId,
  });

  const { weekStart, weekEnd } = useMemo(() => {
    const selected = DateTime.fromJSDate(selectedDate).setZone(timeZone);

    // Force week start to Sunday
    const start = selected
      .minus({ days: selected.weekday % 7 }) // Sunday = 7 % 7 = 0, Monday = 1 % 7 = 1, etc.
      .startOf("day");

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

  const moveDatesSet = useMemo(() => {
    return new Set(
      moves.map((move) =>
        DateTime.fromISO(move.moveDate ?? "")
          .setZone(timeZone)
          .toISODate()
      )
    );
  }, [moves, timeZone]);

  const getTotalPriceForDate = (date: Date): string | null => {
    const isoDate = DateTime.fromJSDate(date).setZone(timeZone).toISODate();
    const moveOnDate = moves.find((move) => {
      const moveDate = DateTime.fromISO(move.moveDate ?? "")
        .setZone(timeZone)
        .toISODate();
      return moveDate === isoDate;
    });
    return "--";
  };

  const getEventDotColor = (date: Date): string | null => {
    const isoDate = DateTime.fromJSDate(date).setZone(timeZone).toISODate();

    const moveOnDate = moves.find((move) => {
      const moveDate = DateTime.fromISO(move.moveDate ?? "")
        .setZone(timeZone)
        .toISODate();
      return moveDate === isoDate;
    });

    return moveOnDate ? getStatusColor(moveOnDate.status) : null;
  };

  const handleNavigation = (direction: "prev" | "next") => {
    const current = DateTime.fromJSDate(selectedDate).setZone(timeZone);

    const newDate = isWeekView
      ? current.plus({ weeks: direction === "next" ? 1 : -1 })
      : current.plus({ months: direction === "next" ? 1 : -1 });

    setSelectedDate(newDate.toJSDate());

    // Also update the calendarMonthYear state if in month view
    if (!isWeekView) {
      setCalendarMonthYear({
        month: newDate.month,
        year: newDate.year,
      });
    }
  };

  return (
    <PageContainer className="gap-2 pb-10">
      <CalendarNav
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        isList={isList}
        setIsList={setIsList}
      />
      {isList ? (
        <DateRangeFields
          startDate={filterStartDate}
          endDate={filterEndDate}
          setStartDate={setFilterStartDate}
          setEndDate={setFilterEndDate}
        />
      ) : (
        <>
          <CalendarSwitcher
            isWeekView={isWeekView}
            date={selectedDate}
            onDateClick={setSelectedDate}
            onNavigate={handleNavigation}
            TIME_ZONE={timeZone}
            today={today}
            getEventDotColor={getEventDotColor}
            getTotalPriceForDate={getTotalPriceForDate}
          />
          <ToggleCalendar
            isWeekView={isWeekView}
            onToggle={() => setIsWeekView(!isWeekView)}
          />
        </>
      )}

      {isLoading && <p>Loading moves...</p>}
      {isError && <p className="text-red-500">{errorMessage}</p>}

      {!isLoading && !isError && (
        <div className="mt-2">
          <h3 className="font-medium pl-4">
            {formatDateToLong(weekStart)} - {formatDateToLong(weekEnd)}
          </h3>
          <MoveCardContainer moves={weeklyMoves} />
        </div>
      )}
    </PageContainer>
  );
};

export default CalendarPage;
