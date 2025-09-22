import FilterRow from "@/app/components/shared/containers/FilterRow";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import AdaptiveSelect from "@/app/components/shared/select/AdaptiveSelect";
import DateRangeFieldsBase from "@/app/components/shared/select/DateRangePanel";
import { useSlugContext } from "@/app/contexts/SlugContext";
import {
  clampEndNotBeforeStart,
  prevNDaysISO,
  todayISO,
} from "@/app/frontendUtils/luxonUtils";
import { HISTORICAL_TIME_OPTIONS } from "@/types/const";
import {
  HISTORICAL_DAYS_BY_VALUE,
  HistoricalTimeValue,
  NUMBER_OF_MOVERS_OPTIONS,
  NumberOfMovers,
  SERVICE_TYPE_OPTIONS,
  ServiceType,
} from "@/types/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const AnalyticsMoves = () => {
  const { timeZone } = useSlugContext();
  const INITIAL_TIME: Exclude<HistoricalTimeValue, "custom"> = "last_30_days";

  const initialSeed = useMemo(() => {
    const days = HISTORICAL_DAYS_BY_VALUE[INITIAL_TIME];
    return prevNDaysISO(timeZone, days, false);
  }, [timeZone]);

  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType>("moving");

  const [selectedNumberOfMovers, setSelectedNumberOfMovers] =
    useState<NumberOfMovers>("2");

  const [selectedTime, setSelectedTime] =
    useState<HistoricalTimeValue>(INITIAL_TIME);

  const [customStartDate, setCustomStartDate] = useState<string | null>(
    initialSeed.start
  );
  const [customEndDate, setCustomEndDate] = useState<string | null>(
    initialSeed.end
  );

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
    (nextValue: string) => {
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
    <SectionContainer>
      <FilterRow>
        <AdaptiveSelect
          title="Select Service Type"
          options={SERVICE_TYPE_OPTIONS}
          value={selectedServiceType}
          onChange={(next) => {
            setSelectedServiceType(next as ServiceType);
          }}
          placeholder="Choose a Service Type"
          searchPlaceholder="Search Service Types…"
          allLabel="All Service Types"
          description="Choose a Sales Rep to see their analytics."
          showSearch={false}
        />
        <AdaptiveSelect
          title="Select Number of Movers"
          options={NUMBER_OF_MOVERS_OPTIONS}
          value={selectedNumberOfMovers}
          onChange={(next) => {
            setSelectedNumberOfMovers(next as NumberOfMovers);
          }}
          placeholder="Choose a source"
          searchPlaceholder="Search sources…"
          description="Choose a source to see their analytics."
          showSearch={false}
        />
        <AdaptiveSelect
          title="Select time"
          options={HISTORICAL_TIME_OPTIONS}
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
          onStartChange={(next) => {
            setCustomStartDate(next);
            setCustomEndDate((prev) => clampEndNotBeforeStart(next, prev));
          }}
          onEndChange={(next) => {
            setCustomEndDate(clampEndNotBeforeStart(customStartDate, next));
          }}
          startMax={today}
          endMax={today}
          endMin={customStartDate ?? undefined}
          className="px-0"
        />
      )}
    </SectionContainer>
  );
};

export default AnalyticsMoves;
