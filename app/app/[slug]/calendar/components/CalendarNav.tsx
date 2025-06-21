import IconButton from "@/app/components/shared/IconButton";
import { Calendar, Filter, List } from "lucide-react";
import React, { useState } from "react";
import FilterModal from "../modals/FilterModal";
import { MoveStatus } from "@/types/types";
import RemovableTag from "@/app/components/shared/ui/RemovableTag";
import { getStatusColor } from "@/app/frontendUtils/helper";
import { cn } from "@/lib/utils";

interface CalendarNavProps {
  selectedStatuses: MoveStatus[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<MoveStatus[]>>;
  isList: boolean;
  setIsList: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalendarNav = ({
  selectedStatuses,
  setSelectedStatuses,
  isList,
  setIsList,
}: CalendarNavProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  return (
    <div className="px-4 md:px-0">
      <div className="flex items-start gap-2 w-full">
        {/* Left: filter + tags (wraps) */}
        <div className="flex flex-wrap gap-2 min-w-0 max-w-full">
          <IconButton
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setIsFilterModalOpen(true)}
            title="Filter"
            className="w-8 h-8 border border-grayCustom rounded-full flex items-center justify-center"
          />
          {selectedStatuses.map((status) => (
            <RemovableTag
              key={status}
              label={status}
              dotColor={getStatusColor(status)}
              onRemove={() =>
                setSelectedStatuses((prev) => prev.filter((s) => s !== status))
              }
            />
          ))}
        </div>

        {/* Right: toggle icons always top-aligned */}
        <div className="flex gap-2 shrink-0 ml-auto">
          <IconButton
            icon={<Calendar className="w-4 h-4" />}
            onClick={() => setIsList(false)}
            title="Calendar"
            className={cn(
              "w-8 h-8 border border-grayCustom rounded-full flex items-center justify-center",
              !isList && "bg-greenCustom border-greenCustom"
            )}
          />
          <IconButton
            icon={<List className="w-4 h-4" />}
            onClick={() => setIsList(true)}
            title="List"
            className={cn(
              "w-8 h-8 border border-grayCustom rounded-full flex items-center justify-center",
              isList && "bg-greenCustom border-greenCustom"
            )}
          />
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
    </div>
  );
};

export default CalendarNav;
