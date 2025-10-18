"use client";

import DateRangeFieldsBase from "@/components/shared/select/DateRangePanel";
import { useMoveFilter } from "@/contexts/MoveFilterContext";

export default function DateRangeFieldsWithFilter() {
  const {
    filterEndDate,
    filterStartDate,
    setFilterEndDate,
    setFilterStartDate,
  } = useMoveFilter();

  return (
    <DateRangeFieldsBase
      startDate={filterStartDate}
      endDate={filterEndDate}
      onStartChange={setFilterStartDate}
      onEndChange={setFilterEndDate}
    />
  );
}
