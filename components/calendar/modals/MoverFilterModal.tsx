"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FormActions from "@/components/shared/buttons/FormActions";
import { MOVER_MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import LabeledCheckboxGroup from "@/components/shared/labeled/LabeledCheckboxGroup";
import ButtonRadioGroup from "@/components/shared/labeled/ButtonRadioGroup";
import { PRICE_FILTER_OPTIONS, PriceOrder } from "@/types/tsx-types";
import { useMoveFilter } from "@/contexts/MoveFilterContext";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoverFilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  const { selectedStatuses, setSelectedStatuses, setPriceFilter, priceFilter } =
    useMoveFilter();

  const [tempStatuses, setTempStatuses] =
    useState<MoveStatus[]>(selectedStatuses);
  const [tempPriceFilter, setTempPriceFilter] = useState<PriceOrder | null>(
    priceFilter
  );

  useEffect(() => {
    if (isOpen) {
      setTempStatuses(selectedStatuses);
      setTempPriceFilter(priceFilter);
    }
  }, [isOpen, selectedStatuses, priceFilter]);

  const handleSubmit = () => {
    setSelectedStatuses(tempStatuses);
    setPriceFilter(tempPriceFilter);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="border-none h-screen w-full max-w-md p-6 bg-background2 overflow-y-auto z-[999]"
      >
        <SheetHeader>
          <SheetTitle className="text-lg text-white">Filter Moves</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <FieldGroup>
            <LabeledCheckboxGroup
              label="Move Status"
              name="status"
              values={tempStatuses}
              options={MOVER_MOVE_STATUS_OPTIONS}
              onChange={(newValues) =>
                setTempStatuses(newValues.map((v) => v as MoveStatus))
              }
            />

            <ButtonRadioGroup
              name="priceOrder"
              label="Price Filter"
              layout="vertical"
              options={PRICE_FILTER_OPTIONS}
              value={tempPriceFilter}
              onChange={(val) => setTempPriceFilter(val as PriceOrder)}
            />

            <FormActions
              onSave={handleSubmit}
              onCancel={onClose}
              isSaving={false}
              error={null}
              saveLabel="Apply Filters"
              cancelLabel="Cancel"
            />
          </FieldGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MoverFilterModal;
