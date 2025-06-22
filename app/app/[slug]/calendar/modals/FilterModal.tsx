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
import { MOVE_STATUS_OPTIONS, MoveStatus, PriceFilter } from "@/types/types";
import LabeledCheckboxGroup from "@/app/components/shared/labeled/LabeledCheckboxGroup";
import ButtonRadioGroup from "@/app/components/shared/labeled/ButtonRadioGroup";
import { PRICE_FILTER_OPTIONS } from "@/types/tsx-types";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import { useGetSalesReps } from "@/app/hooks/queries/useGetSalesReps";
import { useSlugContext } from "@/app/contexts/SlugContext";
import {
  SalesRepOption,
  useMoveFilter,
} from "@/app/contexts/MoveFilterContext";
import {
  priceFilterToOrder,
  priceOrderToFilter,
} from "@/app/frontendUtils/helper";

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
    priceFilter,
    salesRep,
  } = useMoveFilter();
  const [tempStatuses, setTempStatuses] =
    useState<MoveStatus[]>(selectedStatuses);
  const [tempPriceFilter, setTempPriceFilter] = useState<PriceFilter | null>(
    null
  );
  const [tempSalesRep, setTempSalesRep] = useState<SalesRepOption | null>(null);
  const { users, isLoading: isLoadingSalesRepOptions } =
    useGetSalesReps(companyId);

  const salesRepOptions: SalesRepOption[] =
    users?.map((user) => ({
      id: user._id,
      name: user.name,
    })) ?? [];

  useEffect(() => {
    if (isOpen) {
      setTempStatuses(selectedStatuses);
      setTempPriceFilter(priceOrderToFilter(priceFilter));
      setTempSalesRep(salesRep);
    }
  }, [isOpen, selectedStatuses, priceFilter, salesRep]);

  const handleSubmit = () => {
    setSelectedStatuses(tempStatuses);
    setPriceFilter(priceFilterToOrder(tempPriceFilter));
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

        <div className="mt-4 ">
          <FieldGroup>
            <LabeledSelect
              label="Sales Rep"
              value={tempSalesRep?.id ?? null}
              options={salesRepOptions.map((rep) => ({
                label: rep.name,
                value: rep.id,
              }))}
              onChange={(value) => {
                const selectedRep = salesRepOptions.find(
                  (rep) => rep.id === value
                );
                if (selectedRep) {
                  setTempSalesRep(selectedRep);
                }
              }}
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
              name="priceFilter"
              value={tempPriceFilter}
              options={PRICE_FILTER_OPTIONS}
              onChange={(val) => setTempPriceFilter(val as PriceFilter)}
              label="Price Filter"
              layout="vertical"
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
