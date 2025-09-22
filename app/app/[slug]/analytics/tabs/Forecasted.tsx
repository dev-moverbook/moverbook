"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import AdaptiveSelect from "@/app/components/shared/select/AdaptiveSelect";
import DateRangeFieldsBase from "@/app/components/shared/select/DateRangePanel";

import {
  FORECAST_DAYS_BY_VALUE,
  ForecastTimeValue,
  Option,
} from "@/types/types";
import { Users } from "lucide-react";
import { FORECASTED_TIME_OPTIONS } from "@/types/const";
import {
  nextNDaysISO,
  computeEndMinISO,
  tomorrowISO,
} from "@/app/frontendUtils/luxonUtils";
import { useSlugContext } from "@/app/contexts/SlugContext";
import FilterRow from "@/app/components/shared/containers/FilterRow";

interface ForecastedProps {
  userOptions: Option[];
  sourceOptions: Option[];
}

export default function Forecasted({
  userOptions,
  sourceOptions,
}: ForecastedProps) {
  const { timeZone } = useSlugContext();

  const INITIAL_TIME: ForecastTimeValue = "next_7_days";

  const initialSeed = useMemo(() => {
    const days = FORECAST_DAYS_BY_VALUE[INITIAL_TIME];
    return nextNDaysISO(timeZone, days, false);
  }, [timeZone]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] =
    useState<ForecastTimeValue>(INITIAL_TIME);

  const [customStartDate, setCustomStartDate] = useState<string | null>(
    initialSeed.start
  );
  const [customEndDate, setCustomEndDate] = useState<string | null>(
    initialSeed.end
  );

  const showCustomRange = selectedTime === "custom";

  const seedRangeFromPreset = useCallback(
    (preset: Exclude<ForecastTimeValue, "custom">) => {
      const days = FORECAST_DAYS_BY_VALUE[preset] ?? 7;
      return nextNDaysISO(timeZone, days, false);
    },
    [timeZone]
  );

  const handleTimeChange = useCallback(
    (nextValue: string) => {
      const next = nextValue as ForecastTimeValue;

      if (next === "custom") {
        const lastPreset =
          selectedTime === "custom"
            ? "next_7_days"
            : (selectedTime as Exclude<ForecastTimeValue, "custom">);

        const { start, end } = seedRangeFromPreset(lastPreset);
        setCustomStartDate(start);
        setCustomEndDate(end);
      } else {
        const { start, end } = seedRangeFromPreset(next);
        setCustomStartDate(start);
        setCustomEndDate(end);
      }

      setSelectedTime(next);
    },
    [selectedTime, seedRangeFromPreset]
  );

  useEffect(() => {
    if (selectedTime !== "custom") {
      const preset = selectedTime as Exclude<ForecastTimeValue, "custom">;
      const { start, end } = seedRangeFromPreset(preset);
      setCustomStartDate(start);
      setCustomEndDate(end);
    }
  }, [timeZone, selectedTime, seedRangeFromPreset]);

  return (
    <SectionContainer>
      <FilterRow>
        <AdaptiveSelect
          title="Select Sales Rep"
          options={userOptions}
          value={selectedUserId}
          onChange={setSelectedUserId}
          placeholder="Choose a Sales Rep"
          searchPlaceholder="Search Sales Reps…"
          allLabel="All Reps"
          allIcon={<Users className="h-6 w-6 text-white" />}
          description="Choose a Sales Rep to see their analytics."
        />

        <AdaptiveSelect
          title="Select source"
          options={sourceOptions}
          value={selectedSource}
          onChange={setSelectedSource}
          placeholder="Choose a source"
          searchPlaceholder="Search sources…"
          allLabel="All sources"
          description="Choose a source to see their analytics."
        />

        <AdaptiveSelect
          title="Select time"
          options={FORECASTED_TIME_OPTIONS}
          value={selectedTime}
          onChange={handleTimeChange}
          placeholder="Choose a time"
          description="Choose a time to see their analytics."
          showSearch={false}
        />
      </FilterRow>

      {showCustomRange && (
        <DateRangeFieldsBase
          startDate={customStartDate}
          endDate={customEndDate}
          onStartChange={setCustomStartDate}
          onEndChange={setCustomEndDate}
          startMin={tomorrowISO(timeZone)}
          startMax={customEndDate ?? undefined}
          endMin={computeEndMinISO(customStartDate, timeZone)}
          className="px-0"
        />
      )}
    </SectionContainer>
  );
}
