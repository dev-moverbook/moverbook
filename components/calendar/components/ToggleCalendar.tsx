"use client";

import { Button } from "@/components/ui/button";
import { useMoveFilter } from "@/contexts/MoveFilterContext";

const ToggleCalendar = () => {
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
