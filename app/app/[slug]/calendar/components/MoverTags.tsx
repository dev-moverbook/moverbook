// app/app/[slug]/moves/components/nav/MoverTags.tsx
"use client";

import { useMoveFilter } from "@/app/contexts/MoveFilterContext";
import { Badge } from "@/components/ui/badge";
import { MoveTimes, MoveStatus } from "@/types/types";
import React from "react";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/app/frontendUtils/helper";

const LABELS: Record<MoveTimes, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  custom: "Custom",
};

const MoverTags: React.FC = () => {
  const {
    moveTimeFilter,
    setMoveTimeFilter,
    selectedStatuses,
    setSelectedStatuses,
  } = useMoveFilter();

  const defaultStatuses: MoveStatus[] = ["New Lead", "Booked", "Quoted"];

  const handleMoveTimeToggle = (time: MoveTimes) => {
    setMoveTimeFilter((prev: MoveTimes[]) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const isCompletedActive =
    selectedStatuses.length === 1 && selectedStatuses[0] === "Completed";

  const handleCompletedToggle = () => {
    if (isCompletedActive) {
      setSelectedStatuses(defaultStatuses);
    } else {
      setSelectedStatuses(["Completed"]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 min-w-0 max-w-full">
      {(Object.keys(LABELS) as MoveTimes[]).map((time) => {
        const isActive = moveTimeFilter.includes(time);
        return (
          <Badge
            key={time}
            active={isActive}
            variant={isActive ? "default" : "outline"}
            onClick={() => handleMoveTimeToggle(time)}
            className={cn("px-4 hover:bg-background2")}
          >
            <span className="inline-flex items-center">
              <span
                className="w-1.5 h-1.5 rounded-full mr-1"
                style={{ backgroundColor: getStatusColor(time) }}
              />
              {LABELS[time]}
            </span>
          </Badge>
        );
      })}

      <Badge
        active={isCompletedActive}
        variant={isCompletedActive ? "default" : "outline"}
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
