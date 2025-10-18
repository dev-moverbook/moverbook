"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
import CounterInput from "./CounterInput";
import { formatDecimalHours } from "@/frontendUtils/timeUtils";

interface BreakTimeInputProps {
  hours: number;
  minutes: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
  isEditing: boolean;
  label?: string;
}

const BreakTimeInput: React.FC<BreakTimeInputProps> = ({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
  isEditing,
  label = "Break Time",
}) => {
  if (!isEditing) {
    return (
      <FieldDisplay
        label={label}
        value={formatDecimalHours(hours, minutes)}
        fallback="—"
      />
    );
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-12 mt-2">
        <CounterInput
          label="Hours"
          value={hours}
          onChange={onHoursChange}
          min={0}
          labelClassName="text-grayCustom2"
        />
        <CounterInput
          label="Minutes"
          value={minutes}
          onChange={onMinutesChange}
          min={0}
          max={59}
          labelClassName="text-grayCustom2"
        />
      </div>
    </div>
  );
};

export default BreakTimeInput;
