"use client";

import { Button } from "@/app/components/ui/button";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

interface ToggleCalendarProps {}

const ToggleCalendar: React.FC<ToggleCalendarProps> = ({}) => {
  const { isWeekView, setIsWeekView } = useMoveFilter();

  const buttonText = isWeekView ? "Expand" : "Collapse";
  return (
    <div className="flex justify-center ">
      <Button
        variant="link"
        onClick={() => setIsWeekView(!isWeekView)}
        className=" text-grayText hover:text-whiteText transition "
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ToggleCalendar;
