"use client";

import { Button } from "@/app/components/ui/button";
import React from "react";

type DateRangeControlsProps = {
  startDate: string;
  endDate: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  className?: string;
  dateLabelFormatter?: (isoDate: string) => string;
  previousText?: string;
  nextText?: string;
};

export default function DateRangeControls({
  startDate,
  endDate,
  onPrevWeek,
  onNextWeek,
  canGoBack,
  canGoForward,
  className,
  dateLabelFormatter,
  previousText = "Previous Week",
  nextText = "Next Week",
}: DateRangeControlsProps) {
  const formatDateRangeLabel =
    dateLabelFormatter ?? ((isoDateString: string) => isoDateString);

  const formattedStart = formatDateRangeLabel(startDate);
  const formattedEnd = formatDateRangeLabel(endDate);

  return (
    <div className={className}>
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
        <Button
          variant="combobox"
          type="button"
          onClick={onPrevWeek}
          disabled={canGoBack === false}
        >
          {previousText}
        </Button>

        <div className="text-center ">
          <p className="font-semibold">
            {formattedStart} - {formattedEnd}
          </p>
        </div>

        <Button
          variant="combobox"
          type="button"
          onClick={onNextWeek}
          disabled={canGoForward === false}
        >
          {nextText}
        </Button>
      </div>
    </div>
  );
}
