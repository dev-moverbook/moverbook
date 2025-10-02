"use client";

import React, { useMemo, useState } from "react";
import {
  initialForecastRange,
  moveRangeByWeeksGuarded,
  canMoveBackOneWeek,
} from "@/app/frontendUtils/graphHelpers";
import DateRangeControls from "@/app/components/shared/graphs/headers/DateRangeControls";
import ForecastedByRepsAnalytics from "./ForecastedByRepsAnalytics";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { formatMonthDayLabelStrict } from "@/app/frontendUtils/luxonUtils";

export default function ForecastedByReps() {
  const initialRange = useMemo(() => initialForecastRange(), []);
  const [customStartDate, setCustomStartDate] = useState<string>(
    initialRange.startDate
  );
  const [customEndDate, setCustomEndDate] = useState<string>(
    initialRange.endDate
  );

  function handleNextWeek(): void {
    const result = moveRangeByWeeksGuarded(customStartDate, 1);
    if (result.moved) {
      setCustomStartDate(result.startDate);
      setCustomEndDate(result.endDate);
    }
  }

  function handlePrevWeek(): void {
    const result = moveRangeByWeeksGuarded(customStartDate, -1);
    if (result.moved) {
      setCustomStartDate(result.startDate);
      setCustomEndDate(result.endDate);
    }
  }

  const backDisabled = !canMoveBackOneWeek(customStartDate);

  return (
    <SectionContainer showBorder={false}>
      <DateRangeControls
        startDate={customStartDate}
        endDate={customEndDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        canGoBack={!backDisabled}
        className=""
        dateLabelFormatter={(iso) => formatMonthDayLabelStrict(iso)}
      />
      <ForecastedByRepsAnalytics
        startDate={customStartDate}
        endDate={customEndDate}
      />
    </SectionContainer>
  );
}
