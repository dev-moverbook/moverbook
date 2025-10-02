"use client";

import React, { useMemo, useState } from "react";
import {
  initialForecastRange,
  moveRangeByWeeksGuarded,
  canMoveBackOneWeek,
} from "@/app/frontendUtils/graphHelpers";
import DateRangeControls from "@/app/components/shared/graphs/headers/DateRangeControls";
import ForecastedBySourceAnalytics from "./ForecastedBySourceAnalytics";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { formatMonthDayLabelStrict } from "@/app/frontendUtils/luxonUtils";

export default function ForecastedBySource() {
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
        dateLabelFormatter={(iso) => formatMonthDayLabelStrict(iso)}
      />
      <ForecastedBySourceAnalytics
        startDate={customStartDate}
        endDate={customEndDate}
      />
    </SectionContainer>
  );
}
