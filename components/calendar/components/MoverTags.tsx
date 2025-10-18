"use client";

import { useMoveFilter } from "@/contexts/MoveFilterContext";
import { Badge } from "@/components/ui/badge";
import { MoveTimes, MoveStatus, WINDOW_LABEL } from "@/types/types";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/frontendUtils/helper";

const MoverTags: React.FC = () => {
  const {
    moveTimeFilter,
    setMoveTimeFilter,
    selectedStatuses,
    setSelectedStatuses,
  } = useMoveFilter();

  const defaultStatuses: MoveStatus[] = ["New Lead", "Booked", "Quoted"];

  const isCompletedActive = selectedStatuses.includes("Completed");

  const handleCompletedToggle = () => {
    if (isCompletedActive) {
      setSelectedStatuses(defaultStatuses);
    } else {
      setMoveTimeFilter([]);
      setSelectedStatuses(["Completed"]);
    }
  };

  const handleMoveTimeToggle = (time: MoveTimes) => {
    if (isCompletedActive) {
      setSelectedStatuses(defaultStatuses);
      setMoveTimeFilter([time]);
      return;
    }
    setMoveTimeFilter((prev: MoveTimes[]) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  return (
    <div className="flex flex-wrap gap-1 min-w-0 max-w-full">
      {(Object.keys(WINDOW_LABEL) as MoveTimes[]).map((time) => {
        const isActive = moveTimeFilter.includes(time) && !isCompletedActive;
        return (
          <Badge
            key={time}
            active={isActive}
            variant={isActive ? "active" : "outline"}
            onClick={() => handleMoveTimeToggle(time)}
            className={cn(
              "px-4 hover:bg-background2",
              isCompletedActive && "opacity-60"
            )}
          >
            <span className="inline-flex items-center">
              <span
                className="w-1.5 h-1.5 rounded-full mr-1"
                style={{ backgroundColor: getStatusColor(time) }}
              />
              {WINDOW_LABEL[time]}
            </span>
          </Badge>
        );
      })}

      <Badge
        active={isCompletedActive}
        variant={isCompletedActive ? "active" : "outline"}
        onClick={handleCompletedToggle}
        className={cn("px-4 hover:bg-background2")}
      >
        <span className="inline-flex items-center">
          <span
            className="w-1.5 h-1.5 rounded-full mr-1"
            style={{ backgroundColor: getStatusColor("Completed") }}
          />
          Completed
        </span>
      </Badge>
    </div>
  );
};

export default MoverTags;
