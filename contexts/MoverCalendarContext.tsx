"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSlugContext } from "@/contexts/SlugContext";
import { getCurrentDate } from "../frontendUtils/helper";
import { useMovesForMoverCalendar } from "../hooks/moves/useMovesForMoverCalendar";
import { Option } from "@/types/types";

interface MoverCalendarContextProps {
  mover: Option | null;
  setMover: React.Dispatch<React.SetStateAction<Option | null>>;
  moverOptions: Option[];
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

  const moverOptions = useMemo<Option[]>(
    () =>
      allMovers.map((mover) => ({
        value: mover._id as Id<"users">,
        label: mover.name || "Unnamed",
        image: mover.imageUrl,
      })),
    [allMovers]
  );

  const [mover, setMover] = useState<Option | null>(null);
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
          moverId: mover?.value ?? null,
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
