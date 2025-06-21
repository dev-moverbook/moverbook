"use client";

import React, { useState } from "react";
import FieldDate from "@/app/components/shared/field/FieldDate";

interface DateRangeFieldsProps {
  initialStart?: string;
  initialEnd?: string;
  onChange?: (range: { startDate: string; endDate: string }) => void;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

const DateRangeFields: React.FC<DateRangeFieldsProps> = ({
  onChange,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);

    if (onChange) {
      onChange({ startDate: newStart, endDate });
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);

    if (onChange) {
      onChange({ startDate, endDate: newEnd });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 px-4 md:px-0 mt-2">
      <FieldDate
        label="Start Date"
        name="startDate"
        value={startDate}
        onChange={handleStartChange}
        max={endDate || undefined}
      />
      <FieldDate
        label="End Date"
        name="endDate"
        value={endDate}
        onChange={handleEndChange}
        min={startDate || undefined}
      />
    </div>
  );
};

export default DateRangeFields;
