"use client";

import React, { useMemo, useState } from "react";
import {
  canMoveForwardOneWeek,
  planHistoricalWeekMove,
  initialHistoricalRange,
} from "@/app/frontendUtils/graphHelpers";
import DateRangeControls from "@/app/components/shared/graphs/headers/DateRangeControls";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { formatMonthDayLabelStrict } from "@/app/frontendUtils/luxonUtils";
import HistoricalByRepsAnalytics from "./HistoricalByRepsAnalytics";

export default function HistoricalByReps() {
  const initialRange = useMemo(() => initialHistoricalRange(), []);
  const [customStartDate, setCustomStartDate] = useState(
    initialRange.startDate
  );
  const [customEndDate, setCustomEndDate] = useState(initialRange.endDate);

  function handleNextWeek(): void {
    const result = planHistoricalWeekMove(customStartDate, 1);
    if (result.canMove) {
      setCustomStartDate(result.nextStartDate);
      setCustomEndDate(result.nextEndDate);
    }
  }

  function handlePrevWeek(): void {
    const result = planHistoricalWeekMove(customStartDate, -1);
    if (result.canMove) {
      setCustomStartDate(result.nextStartDate);
      setCustomEndDate(result.nextEndDate);
    }
  }

  const canGoForward = canMoveForwardOneWeek(customEndDate);

  return (
    <SectionContainer showBorder={false}>
      <DateRangeControls
        startDate={customStartDate}
        endDate={customEndDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        dateLabelFormatter={(iso) => formatMonthDayLabelStrict(iso)}
        canGoForward={canGoForward}
      />
      <HistoricalByRepsAnalytics
        startDate={customStartDate}
        endDate={customEndDate}
      />
    </SectionContainer>
  );
}
