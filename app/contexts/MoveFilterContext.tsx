"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { DateTime } from "luxon";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { MoveStatus, MoveTimes, PriceOrder } from "@/types/types";
import { Id } from "@/convex/_generated/dataModel";
import { getCurrentDate } from "../frontendUtils/helper";
import { EnrichedMove } from "@/types/convex-responses";
import { QueryStatus } from "@/types/enums";
import { useMovesForCalendar } from "@/app/hooks/queries/useGetMovesForCalendar";

export type SalesRepOption = { id: Id<"users">; name: string };

interface MoveFilterContextProps {
  selectedStatuses: MoveStatus[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<MoveStatus[]>>;
  filterStartDate: string;
  setFilterStartDate: React.Dispatch<React.SetStateAction<string>>;
  filterEndDate: string;
  setFilterEndDate: React.Dispatch<React.SetStateAction<string>>;
  priceFilter: PriceOrder | null;
  setPriceFilter: React.Dispatch<React.SetStateAction<PriceOrder | null>>;
  salesRep: SalesRepOption | null;
  setSalesRep: React.Dispatch<React.SetStateAction<SalesRepOption | null>>;
  moves: EnrichedMove[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isList: boolean;
  setIsList: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  today: Date;
  isWeekView: boolean;
  setIsWeekView: React.Dispatch<React.SetStateAction<boolean>>;
  moveTimeFilter: MoveTimes[];
  setMoveTimeFilter: React.Dispatch<React.SetStateAction<MoveTimes[]>>;
}

const MoveFilterContext = createContext<MoveFilterContextProps | undefined>(
  undefined
);

export const MoveFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { companyId, timeZone } = useSlugContext();

  const today = getCurrentDate(timeZone);
  const todayISO = DateTime.fromJSDate(today).setZone(timeZone).toISODate()!;
  const weekLaterISO = DateTime.fromJSDate(today)
    .setZone(timeZone)
    .plus({ days: 7 })
    .toISODate()!;

  const [selectedStatuses, setSelectedStatuses] = useState<MoveStatus[]>([
    "New Lead",
    "Booked",
    "Quoted",
  ]);
  const [filterStartDate, setFilterStartDate] = useState<string>(todayISO);
  const [filterEndDate, setFilterEndDate] = useState<string>(weekLaterISO);
  const [priceFilter, setPriceFilter] = useState<PriceOrder | null>(null);
  const [salesRep, setSalesRep] = useState<SalesRepOption | null>(null);
  const [isList, setIsList] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [isWeekView, setIsWeekView] = useState<boolean>(true);
  const [moveTimeFilter, setMoveTimeFilter] = useState<MoveTimes[]>([
    "morning",
    "afternoon",
    "custom",
  ]);
  const selectedMonth = DateTime.fromJSDate(selectedDate).setZone(timeZone);
  const monthStart = selectedMonth.startOf("month").toISODate()!;
  const monthEnd = selectedMonth.endOf("month").toISODate()!;

  const queryStart = isList ? filterStartDate : monthStart;
  const queryEnd = isList ? filterEndDate : monthEnd;

  const movesResult = useMovesForCalendar({
    start: queryStart,
    end: queryEnd,
    companyId,
    salesRepId: salesRep?.id ?? null,
    statuses: selectedStatuses,
    priceOrder: priceFilter,
    moveTimeFilter,
  });

  let isLoading = false;
  let isError = false;
  let errorMessage: string | null = null;

  switch (movesResult.status) {
    case QueryStatus.LOADING:
      isLoading = true;
      break;
    case QueryStatus.ERROR:
      isError = true;
      errorMessage = movesResult.errorMessage;
      break;
    case QueryStatus.SUCCESS:
      // handled via memoizedMoves
      break;
  }

  const memoizedMoves = useMemo<EnrichedMove[]>(() => {
    if (movesResult.status === QueryStatus.SUCCESS) {
      return movesResult.data;
    }
    return [];
  }, [movesResult]);

  const value = useMemo(
    () => ({
      selectedStatuses,
      setSelectedStatuses,
      filterStartDate,
      setFilterStartDate,
      filterEndDate,
      setFilterEndDate,
      priceFilter,
      setPriceFilter,
      salesRep,
      setSalesRep,
      moves: memoizedMoves,
      isLoading,
      isError,
      errorMessage,
      isList,
      setIsList,
      selectedDate,
      setSelectedDate,
      today,
      isWeekView,
      setIsWeekView,
      moveTimeFilter,
      setMoveTimeFilter,
    }),
    [
      selectedStatuses,
      filterStartDate,
      filterEndDate,
      priceFilter,
      salesRep,
      memoizedMoves,
      isLoading,
      isError,
      errorMessage,
      isList,
      selectedDate,
      today,
      isWeekView,
      moveTimeFilter,
    ]
  );

  return (
    <MoveFilterContext.Provider value={value}>
      {children}
    </MoveFilterContext.Provider>
  );
};

export const useMoveFilter = () => {
  const context = useContext(MoveFilterContext);
  if (!context) {
    throw new Error("useMoveFilter must be used within a MoveFilterProvider");
  }
  return context;
};
