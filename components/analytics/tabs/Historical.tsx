"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import AdaptiveSelect from "@/components/shared/select/AdaptiveSelect";
import DateRangeFieldsBase from "@/components/shared/select/DateRangePanel";
import {
  HISTORICAL_DAYS_BY_VALUE,
  HistoricalTimeValue,
  Option,
} from "@/types/types";
import { Users } from "lucide-react";
import { HISTORICAL_TIME_OPTIONS } from "@/types/const";
import { prevNDaysISO, todayISO } from "@/frontendUtils/luxonUtils";
import { useSlugContext } from "@/contexts/SlugContext";
import FilterRow from "@/components/shared/containers/FilterRow";
import HistoricalAnalytics from "./sections/HistoricalAnalytics";
import { Id } from "@/convex/_generated/dataModel";
import FunnelAnalytics from "./sections/FunnelAnalytics";

interface HistoricalProps {
  userOptions: Option[];
  sourceOptions: Option[];
}

const Historical = ({ userOptions, sourceOptions }: HistoricalProps) => {
  const { timeZone } = useSlugContext();
  const INITIAL_TIME: Exclude<HistoricalTimeValue, "custom"> = "last_30_days";

  const initialSeed = useMemo(() => {
    const days = HISTORICAL_DAYS_BY_VALUE[INITIAL_TIME];
    return prevNDaysISO(timeZone, days, false);
  }, [timeZone]);

  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(
    null
  );
  const [selectedSource, setSelectedSource] = useState<Id<"referrals"> | null>(
    null
  );
  const [selectedTime, setSelectedTime] =
    useState<HistoricalTimeValue>(INITIAL_TIME);

  const [customStartDate, setCustomStartDate] = useState<string>(
    initialSeed.start
  );
  const [customEndDate, setCustomEndDate] = useState<string>(initialSeed.end);

  const showCustomRange = selectedTime === "custom";
  const today = todayISO(timeZone);

  const seedRangeFromPreset = useCallback(
    (preset: Exclude<HistoricalTimeValue, "custom">) => {
      const days = HISTORICAL_DAYS_BY_VALUE[preset] ?? 30;
      return prevNDaysISO(timeZone, days, false);
    },
    [timeZone]
  );

  const handleTimeChange = useCallback(
    (nextValue: string | null) => {
      const next = nextValue as HistoricalTimeValue;
      if (next === "custom") {
        const lastPreset =
          selectedTime === "custom"
            ? INITIAL_TIME
            : (selectedTime as Exclude<HistoricalTimeValue, "custom">);
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
    [selectedTime, seedRangeFromPreset, INITIAL_TIME]
  );

  useEffect(() => {
    if (selectedTime !== "custom") {
      const preset = selectedTime as Exclude<HistoricalTimeValue, "custom">;
      const { start, end } = seedRangeFromPreset(preset);
      setCustomStartDate(start);
      setCustomEndDate(end);
    }
  }, [timeZone, selectedTime, seedRangeFromPreset]);

  return (
    <SectionContainer showBorder={false}>
      <FilterRow>
        <AdaptiveSelect
          title="Select time"
          options={HISTORICAL_TIME_OPTIONS}
          value={selectedTime}
          onChange={handleTimeChange}
          placeholder="Choose a time"
          description="Choose a time range to see their analytics."
          showSearch={false}
        />
        <AdaptiveSelect
          title="Select Sales Rep"
          options={userOptions}
          value={selectedUserId}
          onChange={(value) => setSelectedUserId(value as Id<"users">)}
          placeholder="Choose a Sales Rep"
          searchPlaceholder="Search Sales Reps…"
          allLabel="All Reps"
          triggerLabel="Reps"
          allIcon={<Users className="h-6 w-6 text-white" />}
          description="Choose a Sales Rep to see their analytics."
        />
        <AdaptiveSelect
          title="Select source"
          options={sourceOptions}
          value={selectedSource}
          onChange={(value) => setSelectedSource(value as Id<"referrals">)}
          placeholder="Choose a source"
          searchPlaceholder="Search sources…"
          allLabel="All Sources"
          triggerLabel="Sources"
          description="Choose a source to see their analytics."
        />
      </FilterRow>
      {showCustomRange && (
        <DateRangeFieldsBase
          startDate={customStartDate}
          endDate={customEndDate}
          onStartChange={setCustomStartDate}
          onEndChange={setCustomEndDate}
          startMax={today}
          endMax={today}
          endMin={customStartDate ?? undefined}
          className="px-0"
        />
      )}
      <HistoricalAnalytics
        startDate={customStartDate}
        endDate={customEndDate}
        salesRepId={selectedUserId}
        referralId={selectedSource}
      />
      <FunnelAnalytics
        startDate={customStartDate}
        endDate={customEndDate}
        salesRepId={selectedUserId}
        referralId={selectedSource}
      />
    </SectionContainer>
  );
};

export default Historical;
