"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { getCurrentDate } from "../frontendUtils/helper";
import { EnrichedMove } from "@/types/convex-responses";
import { QueryStatus } from "@/types/enums";
import { useMovesForCalendar } from "@/app/hooks/queries/useGetMovesForCalendar";

export type MoverOption = { id: Id<"users">; name: string };

interface MoverCalendarContextProps {
  mover: MoverOption | null;
  setMover: React.Dispatch<React.SetStateAction<MoverOption | null>>;
  moverOptions: MoverOption[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  isWeekView: boolean;
  setIsWeekView: React.Dispatch<React.SetStateAction<boolean>>;
  startISO: string;
  endISO: string;
  today: Date;
  moves: EnrichedMove[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const MoverCalendarContext = createContext<
  MoverCalendarContextProps | undefined
>(undefined);

export const MoverCalendarProvider = ({
  children,
  allMovers,
  initialMoverId = null,
}: {
  children: React.ReactNode;
  allMovers: Doc<"users">[];
  initialMoverId?: Id<"users"> | null;
}) => {
  const { companyId, timeZone } = useSlugContext();
  const today = getCurrentDate(timeZone);

  const moverOptions = useMemo<MoverOption[]>(
    () =>
      allMovers.map((m) => ({
        id: m._id as Id<"users">,
        name: m.name || "Unnamed",
      })),
    [allMovers]
  );

  const initialMover =
    (initialMoverId && moverOptions.find((m) => m.id === initialMoverId)) ||
    null;

  const [mover, setMover] = useState<MoverOption | null>(initialMover);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [isWeekView, setIsWeekView] = useState<boolean>(true);

  const { startISO, endISO } = useMemo(() => {
    const dt = DateTime.fromJSDate(selectedDate).setZone(timeZone);
    const start = isWeekView ? dt.startOf("week") : dt.startOf("month");
    const end = isWeekView ? dt.endOf("week") : dt.endOf("month");
    return { startISO: start.toISODate()!, endISO: end.toISODate()! };
  }, [selectedDate, timeZone, isWeekView]);

  const movesResult = useMovesForCalendar({
    start: startISO,
    end: endISO,
    companyId,
    salesRepId: null,
    priceOrder: null,
    moverId: mover?.id ?? null,
    moveTimeFilter: [],
  });

  const isLoading = movesResult.status === QueryStatus.LOADING;
  const isError = movesResult.status === QueryStatus.ERROR;
  const errorMessage =
    movesResult.status === QueryStatus.ERROR ? movesResult.errorMessage : null;

  const moves = useMemo<EnrichedMove[]>(
    () => (movesResult.status === QueryStatus.SUCCESS ? movesResult.data : []),
    [movesResult]
  );

  const value: MoverCalendarContextProps = {
    mover,
    setMover,
    moverOptions,
    selectedDate,
    setSelectedDate,
    isWeekView,
    setIsWeekView,
    startISO,
    endISO,
    today,
    moves,
    isLoading,
    isError,
    errorMessage,
  };

  return (
    <MoverCalendarContext.Provider value={value}>
      {children}
    </MoverCalendarContext.Provider>
  );
};

export const useMoverCalendar = () => {
  const ctx = useContext(MoverCalendarContext);
  if (!ctx)
    throw new Error(
      "useMoverCalendar must be used within a MoverCalendarProvider"
    );
  return ctx;
};
