"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import LabeledCheckboxGroup from "@/app/components/shared/labeled/LabeledCheckboxGroup";
import ButtonRadioGroup from "@/app/components/shared/labeled/ButtonRadioGroup";
import { PRICE_FILTER_OPTIONS, PriceOrder } from "@/types/tsx-types";
import { useSlugContext } from "@/app/contexts/SlugContext";
import {
  SalesRepOption,
  useMoveFilter,
} from "@/app/contexts/MoveFilterContext";
import SalesRepSelect from "@/app/components/shared/select/SalesRepSelect";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  const { companyId } = useSlugContext();
  const {
    selectedStatuses,
    setSelectedStatuses,
    setPriceFilter,
    setSalesRep,
    priceFilter, // PriceOrder | null
    salesRep, // SalesRepOption | null
  } = useMoveFilter();

  const [tempStatuses, setTempStatuses] =
    useState<MoveStatus[]>(selectedStatuses);
  const [tempPriceFilter, setTempPriceFilter] = useState<PriceOrder | null>(
    priceFilter
  );
  const [tempSalesRep, setTempSalesRep] = useState<SalesRepOption | null>(
    salesRep
  );

  useEffect(() => {
    if (isOpen) {
      setTempStatuses(selectedStatuses);
      setTempPriceFilter(priceFilter);
      setTempSalesRep(salesRep);
    }
  }, [isOpen, selectedStatuses, priceFilter, salesRep]);

  const handleSubmit = () => {
    setSelectedStatuses(tempStatuses);
    setPriceFilter(tempPriceFilter);
    setSalesRep(tempSalesRep);
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
            <SalesRepSelect
              companyId={companyId}
              label="Sales Rep"
              value={tempSalesRep}
              onChange={setTempSalesRep}
              placeholder="Select a sales rep"
            />

            <LabeledCheckboxGroup
              label="Move Status"
              name="status"
              values={tempStatuses}
              options={MOVE_STATUS_OPTIONS}
              onChange={(newValues) =>
                setTempStatuses(newValues.map((v) => v as MoveStatus))
              }
            />

            <ButtonRadioGroup
              name="priceOrder"
              label="Price Filter"
              layout="vertical"
              options={PRICE_FILTER_OPTIONS} // "desc" | "asc"
              value={tempPriceFilter} // "desc" | "asc" | null
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

export default FilterModal;
