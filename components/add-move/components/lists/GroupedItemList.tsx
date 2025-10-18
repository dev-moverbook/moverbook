"use client";

import { MoveItemInput } from "@/types/form-types";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDisplayNumber } from "@/frontendUtils/helper";

interface GroupedItemsListProps {
  items: MoveItemInput[];
  selectedItemIndices?: Set<number>;
  onToggle?: (index: number) => void;
  isEditing?: boolean;
}

const GroupedItemsList: React.FC<GroupedItemsListProps> = ({
  items,
  selectedItemIndices = new Set(),
  onToggle,
  isEditing = false,
}) => {
  if (items.length === 0) {
    return <p className="text-grayCustom ">No items have been added.</p>;
  }

  const grouped = items.reduce<Record<string, MoveItemInput[]>>((acc, item) => {
    if (!acc[item.room]) acc[item.room] = [];
    acc[item.room].push(item);
    return acc;
  }, {});

  let itemGlobalIndex = 0;

  return (
    <div>
      {Object.entries(grouped).map(([room, roomItems]) => (
        <div key={room} className="mb-6">
          <h4 className="font-semibold text-lg mb-3">{room}</h4>
          <ul className="space-y-4">
            {roomItems.map((item) => {
              const currentIndex = itemGlobalIndex++;
              const isSelected = selectedItemIndices.has(currentIndex);

              return (
                <li
                  key={currentIndex}
                  className="flex items-start md:items-center gap-3 pl-2 text-sm"
                >
                  {isEditing && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggle?.(currentIndex)}
                      className="mt-[2px] md:mt-0 border-grayCustom data-[state=checked]:bg-greenCustom data-[state=checked]:border-greenCustom"
                      id={`checkbox-${currentIndex}`}
                    />
                  )}

                  <div className="w-full">
                    {/* Row 1: label (always) + desktop metrics (md+) */}
                    <div className="flex w-full items-start md:items-center">
                      <label
                        htmlFor={`checkbox-${currentIndex}`}
                        className="cursor-pointer hover:underline"
                      >
                        <span className="mr-2">{item.quantity}x</span>
                        <span>{item.item}</span>
                      </label>

                      {/* Desktop metrics (right aligned) */}
                      <div className="ml-auto hidden md:flex gap-8 text-grayCustom2 text-sm">
                        <p className="w-24 text-right tabular-nums">
                          {formatDisplayNumber(item.size, "ft³")}
                        </p>
                        <p className="w-24 text-right tabular-nums">
                          {formatDisplayNumber(item.weight, "lbs")}
                        </p>
                      </div>
                    </div>

                    {/* Mobile metrics (stacked below) */}
                    <div className="md:hidden mt-1 text-grayCustom2 text-sm tabular-nums">
                      {formatDisplayNumber(item.size, "ft³")} •{" "}
                      {formatDisplayNumber(item.weight, "lbs")}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GroupedItemsList;
