"use client";

import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

interface ToggleCalendarProps {}

const ToggleCalendar: React.FC<ToggleCalendarProps> = ({}) => {
  const { isWeekView, setIsWeekView } = useMoveFilter();
  return (
    <div className="flex justify-center ">
      <button
        onClick={() => setIsWeekView(!isWeekView)}
        className=" text-grayText hover:text-whiteText transition "
      >
        {isWeekView ? (
          <p className="text-xs underline">Expand</p>
        ) : (
          <p className="text-xs underline">Collapse</p>
        )}
      </button>
    </div>
  );
};

export default ToggleCalendar;
