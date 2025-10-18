"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import IconButton from "../../buttons/IconButton";

type DateRangeControlsProps = {
  startDate: string;
  endDate: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  className?: string;
  dateLabelFormatter?: (isoDate: string) => string;
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
}: DateRangeControlsProps) {
  const formatDateRangeLabel =
    dateLabelFormatter ?? ((isoDateString: string) => isoDateString);

  const formattedStart = formatDateRangeLabel(startDate);
  const formattedEnd = formatDateRangeLabel(endDate);

  return (
    <div className={className}>
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={onPrevWeek}
          disabled={canGoBack === false}
          className="rounded-md border border-grayCustom"
          title="Previous Week"
        />
        <div className="text-center ">
          <p className="font-semibold">
            {formattedStart} - {formattedEnd}
          </p>
        </div>

        <IconButton
          icon={<ChevronRightIcon />}
          onClick={onNextWeek}
          disabled={canGoForward === false}
          className="rounded-md border border-grayCustom"
          title="Next Week"
        />
      </div>
    </div>
  );
}
