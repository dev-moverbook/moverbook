import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import React, { useState } from "react";
import SelectionInventory from "../sections/SelectionInventory";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import Header2 from "@/app/components/shared/heading/Header2";
import AddedItems from "../sections/AddedItems";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
interface InventoryStepProps {
  onNext: () => void;
  onBack: () => void;
}

const InventoryStep = ({ onNext, onBack }: InventoryStepProps) => {
  const { addedItems } = useMoveForm();
  const isCompleted = addedItems.length > 0;
  const [selectedItemIndices, setSelectedItemIndices] = useState<Set<number>>(
    new Set()
  );

  return (
    <FormContainer>
      <Header2 isCompleted={isCompleted}>Inventory</Header2>
      <AddedItems
        selectedItemIndices={selectedItemIndices}
        setSelectedItemIndices={setSelectedItemIndices}
      />
      <SelectionInventory
        selectedItemIndices={selectedItemIndices}
        setSelectedItemIndices={setSelectedItemIndices}
      />

      <FormActionContainer className="pt-10">
        <FormActions
          onSave={onNext}
          onCancel={onBack}
          isSaving={false}
          saveLabel="Next"
          cancelLabel="Back"
        />
      </FormActionContainer>
    </FormContainer>
  );
};

export default InventoryStep;
