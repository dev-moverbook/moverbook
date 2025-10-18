"use client";

import { formatNarrowWeekday } from "@/frontendUtils/helper";

interface WeekdayHeaderProps {
  weekdays: Date[];
}

const WeekdayHeader: React.FC<WeekdayHeaderProps> = ({ weekdays }) => {
  return (
    <div className="flex w-full">
      {weekdays.map((day) => (
        <div
          key={day.toISOString()}
          className="w-[14.2857%] text-center text-xs font-semibold text-grayCustom2"
        >
          {formatNarrowWeekday(undefined, day)}
        </div>
      ))}
    </div>
  );
};

export default WeekdayHeader;
