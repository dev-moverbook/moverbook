"use client";

import { Label } from "@/components/ui/label";
import { useMoverCalendar } from "@/contexts/MoverCalendarContext";
import AdaptiveContainer from "@/components/shared/select/AdaptiveContainer";
import AdaptiveSelect from "@/components/shared/select/AdaptiveSelect";

type MoverSelectProps = {
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function MoverSelect({
  label = "Mover",
  placeholder = "Select mover",
  className,
}: MoverSelectProps) {
  const { mover, setMover, moverOptions } = useMoverCalendar();

  return (
    <div className={className}>
      <AdaptiveContainer>
        <Label>{label}</Label>
        <AdaptiveSelect
          title={placeholder}
          options={moverOptions}
          value={mover?.value ?? null}
          onChange={(value) => {
            const selectedOption =
              moverOptions.find((opt) => opt.value === value) ?? null;
            setMover(selectedOption);
          }}
          placeholder="Select mover"
          triggerLabel="Movers"
          allLabel="All Movers"
          description={label}
          showAllOption={true}
          showSearch={true}
        />
      </AdaptiveContainer>
    </div>
  );
}
