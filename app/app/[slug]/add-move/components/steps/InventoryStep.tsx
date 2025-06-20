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
  const {
    isInventorySectionComplete,
    moveItems,
    updateMoveItem,
    removeMoveItem,
    addMoveItem,
    roomOptions,
    itemOptions,
    categoryOptions,
  } = useMoveForm();
  const [selectedItemIndices, setSelectedItemIndices] = useState<Set<number>>(
    new Set()
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <FormContainer>
      <Header2 isCompleted={isInventorySectionComplete}>Inventory</Header2>
      <AddedItems
        moveItems={moveItems}
        updateMoveItem={updateMoveItem}
        removeMoveItem={removeMoveItem}
        addMoveItem={addMoveItem}
        selectedItemIndices={selectedItemIndices}
        setSelectedItemIndices={setSelectedItemIndices}
        selectedRoom={selectedRoom}
      />
      <SelectionInventory
        selectedItemIndices={selectedItemIndices}
        setSelectedItemIndices={setSelectedItemIndices}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        roomOptions={roomOptions}
        itemOptions={itemOptions}
        updateMoveItem={updateMoveItem}
        removeMoveItem={removeMoveItem}
        addMoveItem={addMoveItem}
        moveItems={moveItems}
        categoryOptions={categoryOptions}
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
