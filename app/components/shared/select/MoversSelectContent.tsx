"use client";

import CounterInput from "../labeled/CounterInput";
import ToggleButtonGroup from "../labeled/ToggleButtonGroup";

type Mode = "all" | "custom";

type MoversSelectContentProps = {
  isAllSelected: boolean;
  selectedCount: number | null;
  min: number;
  max: number;
  onSetAll: () => void;
  onSetCount: (movers: number) => void;
  className?: string;
  isEditing?: boolean;
};

export default function MoversSelectContent({
  isAllSelected,
  selectedCount,
  min,
  max,
  onSetAll,
  onSetCount,
  className,
  isEditing = true,
}: MoversSelectContentProps) {
  const mode: Mode = isAllSelected ? "all" : "custom";

  const options: { label: string; value: Mode }[] = [
    { label: "All Movers", value: "all" },
    { label: "Custom", value: "custom" },
  ];

  const handleModeChange = (next: Mode) => {
    if (next === "all") {
      onSetAll();
    } else {
      onSetCount(selectedCount ?? Math.max(1, min));
    }
  };

  return (
    <div className={className}>
      <ToggleButtonGroup<Mode>
        label="Movers"
        value={mode}
        onChange={handleModeChange}
        options={options}
        isEditing={isEditing}
      />

      {mode === "custom" && (
        <div className="mt-6">
          <CounterInput
            label="Count"
            value={selectedCount}
            onChange={onSetCount}
            min={min}
            max={max}
            isEditingProp={true}
            className="mt-1"
            labelClassName="text-white/80"
          />
        </div>
      )}
    </div>
  );
}
