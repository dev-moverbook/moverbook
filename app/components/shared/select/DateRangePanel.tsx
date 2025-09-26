"use client";

import FieldDate from "@/app/components/shared/field/FieldDate";
import { cn } from "@/lib/utils";

type DateRangeFieldsBaseProps = {
  className?: string;
  endDate?: string | null;
  endMax?: string;
  endMin?: string;
  onEndChange: (value: string) => void;
  onStartChange: (value: string) => void;
  startDate?: string | null;
  startMax?: string;
  startMin?: string;
};

export default function DateRangeFieldsBase({
  className,
  endDate,
  endMax,
  endMin,
  onEndChange,
  onStartChange,
  startDate,
  startMax,
  startMin,
}: DateRangeFieldsBaseProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 px-4 md:px-0 ", className)}>
      <FieldDate
        label="Start Date"
        name="startDate"
        value={startDate ?? ""}
        onChange={(e) => onStartChange(e.target.value)}
        min={startMin}
        max={startMax}
      />
      <FieldDate
        label="End Date"
        name="endDate"
        value={endDate ?? ""}
        onChange={(e) => onEndChange(e.target.value)}
        min={endMin}
        max={endMax}
      />
    </div>
  );
}
