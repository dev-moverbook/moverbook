import FilterRow from "@/app/components/shared/containers/FilterRow";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import AdaptiveSelect from "@/app/components/shared/select/AdaptiveSelect";
import DateRangeFieldsBase from "@/app/components/shared/select/DateRangePanel";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { prevNDaysISO, todayISO } from "@/app/frontendUtils/luxonUtils";
import { HISTORICAL_TIME_OPTIONS } from "@/types/const";
import {
  HISTORICAL_DAYS_BY_VALUE,
  HistoricalTimeValue,
  LOCATION_TYPE_OPTIONS,
  LocationType,
  MOVE_SIZE_OPTIONS,
  MoveSize,
  SERVICE_TYPE_OPTIONS,
  ServiceType,
} from "@/types/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MoveDataAnalytics from "../sections/MoveDataAnalytics";
import MoversSelect from "@/app/components/shared/select/MoversSelect";

const AnalyticsMoves = () => {
  const { timeZone } = useSlugContext();
  const INITIAL_TIME: Exclude<HistoricalTimeValue, "custom"> = "last_30_days";

  const initialSeed = useMemo(() => {
    const days = HISTORICAL_DAYS_BY_VALUE[INITIAL_TIME];
    return prevNDaysISO(timeZone, days, false);
  }, [timeZone]);

  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null);

  const [movers, setMovers] = React.useState<number | null>(null);

  const [selectedLocationType, setSelectedLocationType] =
    useState<LocationType | null>(null);
  const [selectedMoveSize, setSelectedMoveSize] = useState<MoveSize | null>(
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
          description="Choose a time to see their analytics."
          showSearch={false}
        />
        <AdaptiveSelect
          title="Select Service Type"
          options={SERVICE_TYPE_OPTIONS}
          value={selectedServiceType}
          onChange={(next) => {
            setSelectedServiceType(next as ServiceType);
          }}
          placeholder="Choose a Service Type"
          allLabel="All Services"
          description="Choose a Service Type to see their analytics."
          showSearch={false}
          triggerLabel="Services"
        />
        <AdaptiveSelect
          title="Select Location Type"
          options={LOCATION_TYPE_OPTIONS}
          value={selectedLocationType}
          onChange={(next) => {
            setSelectedLocationType(next as LocationType);
          }}
          placeholder="Choose a Location Type"
          allLabel="All Locations"
          description="Choose a Location Type to see their analytics."
          showSearch={false}
          triggerLabel="Locations"
        />
        <AdaptiveSelect
          title="Select Move Size"
          options={MOVE_SIZE_OPTIONS}
          value={selectedMoveSize}
          onChange={(next) => {
            setSelectedMoveSize(next as MoveSize);
          }}
          placeholder="Choose a Move Size"
          allLabel="All Sizes"
          description="Choose a Move Size to see their analytics."
          showSearch={false}
          triggerLabel="Sizes"
        />
        <MoversSelect
          value={movers}
          onChange={setMovers}
          min={1}
          max={20}
          title="Choose movers"
          description={`Use "All Movers" or specify a count.`}
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
      <MoveDataAnalytics
        startDate={customStartDate}
        endDate={customEndDate}
        serviceType={selectedServiceType}
        numberOfMovers={movers}
        locationType={selectedLocationType}
        moveSize={selectedMoveSize}
      />
    </SectionContainer>
  );
};

export default AnalyticsMoves;
