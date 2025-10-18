"use client";

import React, { useMemo, useState } from "react";
import AdaptiveSelectTrigger from "@/components/shared/select/AdaptiveSelectTrigger";
import type { Option } from "@/types/types";
import { cn } from "@/lib/utils";
import ResponsiveSelectOverlay from "./ResponsiveSelectOverlay";
import MoversSelectContent from "./MoversSelectContent";

type MoversValue = number | null;

export interface MoversSelectProps {
  value: MoversValue;
  onChange: (nextValue: MoversValue | null) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
  title?: string;
  description: string;
}

export default function MoversSelect({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  disabled,
  title = "Select movers",
  description,
}: MoversSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isAllSelected = value == null;
  const selectedCount = typeof value === "number" ? value : null;

  const selectedOption: Option | null = useMemo(() => {
    if (selectedCount == null) return null;
    return {
      label: `${selectedCount} ${selectedCount === 1 ? "Mover" : "Movers"}`,
      value: String(selectedCount),
    };
  }, [selectedCount]);

  const trigger = (
    <AdaptiveSelectTrigger
      onOpen={() => setIsOpen(true)}
      open={isOpen}
      disabled={disabled}
      className={cn(className)}
      placeholder="Movers"
      title="Select movers"
      selectedOption={selectedOption}
    />
  );

  return (
    <ResponsiveSelectOverlay
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={trigger}
      title={title}
      description={description}
    >
      <MoversSelectContent
        isAllSelected={isAllSelected}
        selectedCount={selectedCount}
        min={min}
        max={max}
        onSetAll={() => onChange(null)}
        onSetCount={(movers) => onChange(movers)}
      />
    </ResponsiveSelectOverlay>
  );
}
