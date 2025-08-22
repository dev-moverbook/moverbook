"use client";

import IconButton from "@/app/components/shared/IconButton";
import RemovableTag from "@/app/components/shared/ui/RemovableTag";
import { Filter } from "lucide-react";
import { getStatusColor } from "@/app/frontendUtils/helper";
import { PRICE_ORDER_TAG_LABEL_MAP, PriceOrder } from "@/types/tsx-types";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";
import FilterModal from "../modals/FilterModal";
import { useState } from "react";

const FilterTags = () => {
  const {
    selectedStatuses,
    setSelectedStatuses,
    priceFilter,
    setPriceFilter,
    salesRep,
    setSalesRep,
  } = useMoveFilter();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  return (
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

      {priceFilter && (
        <RemovableTag
          label={PRICE_ORDER_TAG_LABEL_MAP[priceFilter as PriceOrder]}
          onRemove={() => setPriceFilter(null)}
        />
      )}

      {salesRep && (
        <RemovableTag
          label={salesRep.name}
          onRemove={() => setSalesRep(null)}
        />
      )}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};

export default FilterTags;
