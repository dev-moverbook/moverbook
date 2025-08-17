"use client";

import FieldDate from "@/app/components/shared/field/FieldDate";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

const DateRangeFields = () => {
  const {
    setFilterStartDate,
    setFilterEndDate,
    filterStartDate,
    filterEndDate,
  } = useMoveFilter();

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setFilterStartDate(newStart);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setFilterEndDate(newEnd);
  };

  return (
    <div className="grid grid-cols-2 gap-4 px-4 md:px-0 mt-2">
      <FieldDate
        label="Start Date"
        name="startDate"
        value={filterStartDate}
        onChange={handleStartChange}
        max={filterEndDate}
      />
      <FieldDate
        label="End Date"
        name="endDate"
        value={filterEndDate}
        onChange={handleEndChange}
        min={filterStartDate}
      />
    </div>
  );
};

export default DateRangeFields;
