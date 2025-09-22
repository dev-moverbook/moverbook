"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Option } from "@/types/types";
import { formatDateRangeLabel } from "@/app/frontendUtils/luxonUtils";

export interface AdaptiveSelectTriggerProps {
  allIcon?: React.ReactNode;
  allValue?: string;
  className?: string;
  customEnd?: string | null;
  customStart?: string | null;
  customValue?: string;
  disabled?: boolean;
  onOpen: () => void;
  open?: boolean;
  placeholder?: string;
  selectedOption: Option | null;
  title?: string;
}

const AdaptiveSelectTrigger = forwardRef<
  HTMLButtonElement,
  AdaptiveSelectTriggerProps
>(
  (
    {
      allIcon,
      allValue = "__ALL__",
      className,
      customEnd = null,
      customStart = null,
      customValue = "custom",
      disabled,
      onOpen,
      open = false,
      placeholder = "Select...",
      selectedOption,
      title = "Select an option",
    },
    ref
  ) => {
    const isAllSelection =
      !!selectedOption && selectedOption.value === allValue;
    const isCustomSelection =
      !!selectedOption && selectedOption.value === customValue;

    const customLabel = isCustomSelection
      ? formatDateRangeLabel(customStart, customEnd)
      : null;

    const displayLabel =
      customLabel ?? (selectedOption ? selectedOption.label : placeholder);

    return (
      <Button
        ref={ref}
        type="button"
        variant="combobox"
        role="combobox"
        aria-label={title}
        aria-expanded={open}
        disabled={disabled}
        onClick={onOpen}
        size="combobox"
        className={cn(
          className,
          "md:w-[200px] w-full",
          open && "border-greenCustom"
        )}
      >
        <span className="flex w-full items-center justify-between">
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {selectedOption ? (
              <>
                {isAllSelection && allIcon && (
                  <span className="h-6 w-6 shrink-0 flex items-center justify-center rounded-full">
                    {allIcon}
                  </span>
                )}

                {!isAllSelection &&
                  !isCustomSelection &&
                  selectedOption.image && (
                    <Image
                      src={selectedOption.image}
                      alt={selectedOption.label}
                      width={24}
                      height={24}
                      className="h-6 w-6 shrink-0 rounded-full object-cover"
                    />
                  )}

                <span className="truncate">
                  {isCustomSelection && !customLabel
                    ? "Custom range"
                    : displayLabel}
                </span>
              </>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-60" />
        </span>
      </Button>
    );
  }
);

AdaptiveSelectTrigger.displayName = "AdaptiveSelectTrigger";
export default AdaptiveSelectTrigger;
