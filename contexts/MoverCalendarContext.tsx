"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSlugContext } from "@/contexts/SlugContext";
import { getCurrentDate } from "../frontendUtils/helper";
import { useMovesForMoverCalendar } from "../hooks/moves/useMovesForMoverCalendar";

export type MoverOption = { id: Id<"users">; name: string };

interface MoverCalendarContextProps {
  mover: MoverOption | null;
  setMover: React.Dispatch<React.SetStateAction<MoverOption | null>>;
  moverOptions: MoverOption[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  startISO: string;
  endISO: string;
  today: Date;
  moves: Doc<"moves">[];
  isLoading: boolean;
}

const MoverCalendarContext = createContext<
  MoverCalendarContextProps | undefined
>(undefined);

export const MoverCalendarProvider = ({
  children,
  allMovers,
}: {
  children: React.ReactNode;
  allMovers: Doc<"users">[];
  initialMoverId?: Id<"users"> | null;
}) => {
  const { companyId, timeZone } = useSlugContext();
  const today = getCurrentDate(timeZone);

  const moverOptions = useMemo<MoverOption[]>(
    () =>
      allMovers.map((mover) => ({
        id: mover._id as Id<"users">,
        name: mover.name || "Unnamed",
      })),
    [allMovers]
  );

  const [mover, setMover] = useState<MoverOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const { startISO, endISO } = useMemo(() => {
    const dt = DateTime.fromJSDate(selectedDate).setZone(timeZone);
    const start = dt.startOf("month");
    const end = dt.endOf("month");
    return { startISO: start.toISODate()!, endISO: end.toISODate()! };
  }, [selectedDate, timeZone]);

  const queryArgs =
    companyId != null
      ? {
          start: startISO,
          end: endISO,
          companyId,
          moverId: mover?.id ?? null,
        }
      : undefined;

  const movesResult = useMovesForMoverCalendar(
    queryArgs as {
      companyId: Id<"companies">;
      moverId: Id<"users"> | null;
      start: string;
      end: string;
    }
  );

  const isLoading = movesResult === undefined;

  const moves = useMemo<Doc<"moves">[]>(() => movesResult ?? [], [movesResult]);

  const value: MoverCalendarContextProps = {
    mover,
    setMover,
    moverOptions,
    selectedDate,
    setSelectedDate,
    startISO,
    endISO,
    today,
    moves,
    isLoading,
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
