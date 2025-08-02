import React, { useState } from "react";
import SectionHeader from "@/app/components/shared/SectionHeader";
import AddedItems from "@/app/app/[slug]/add-move/components/sections/AddedItems";
import SelectionInventory from "@/app/app/[slug]/add-move/components/sections/SelectionInventory";
import { useCompanyInventoryData } from "@/app/hooks/queries/useCompanyInventoryData";
import { useMoveContext } from "@/app/contexts/MoveContext";

interface InventorySectionProps {}

const InventorySection = ({}: InventorySectionProps) => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedItemIndices, setSelectedItemIndices] = useState<Set<number>>(
    new Set()
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const { data: companyInventoryData } = useCompanyInventoryData(
    move.companyId
  );

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <SectionHeader
        title="Inventory"
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onCancelEdit={() => setIsEditing(false)}
        className="mx-auto"
      />
      {/* <GroupedItemsList items={move.moveItems} isEditing={isEditing} /> */}

      <>
        <AddedItems
          moveItems={move.moveItems}
          updateMoveItem={() => {}}
          removeMoveItem={() => {}}
          selectedItemIndices={selectedItemIndices}
          setSelectedItemIndices={setSelectedItemIndices}
          selectedRoom={selectedRoom}
          addMoveItem={() => {}}
          isEditing={isEditing}
        />
        {isEditing && (
          <SelectionInventory
            selectedItemIndices={selectedItemIndices}
            setSelectedItemIndices={setSelectedItemIndices}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            updateMoveItem={() => {}}
            removeMoveItem={() => {}}
            addMoveItem={() => {}}
            moveItems={move.moveItems}
            roomOptions={companyInventoryData?.rooms}
            itemOptions={companyInventoryData?.items}
          />
        )}
      </>
    </div>
  );
};

export default InventorySection;
