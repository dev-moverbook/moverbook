"use client";

import { useState, useCallback, useEffect } from "react";
import SectionHeader from "@/components/shared/section/SectionHeader";
import AddedItems from "@/components/add-move/components/sections/AddedItems";
import SelectionInventory from "@/components/add-move/components/sections/SelectionInventory";
import { Doc } from "@/convex/_generated/dataModel";
import { MoveItemInput } from "@/types/form-types";
import SectionContainer from "@/components/shared/containers/SectionContainer";

interface EditableQuoteInventoryProps {
  initialItems: MoveItemInput[];
  onItemsChange: (items: MoveItemInput[] | undefined) => void;
  items: Doc<"items">[];
  categories: Doc<"categories">[];
  rooms: Doc<"rooms">[];
}

const EditableQuoteInventory = ({
  initialItems,
  onItemsChange,
  items,
  categories,
  rooms,
}: EditableQuoteInventoryProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [localMoveItems, setLocalMoveItems] = useState<MoveItemInput[]>(
    initialItems ?? []
  );

  const [selectedItemIndices, setSelectedItemIndices] = useState<Set<number>>(
    new Set()
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setLocalMoveItems(initialItems ?? []);
      setSelectedItemIndices(new Set());
      setSelectedRoom(null);
      onItemsChange(undefined);
    }
  }, [isEditing, initialItems, onItemsChange]);

  const handleEditClick = () => {
    setIsEditing(true);
    setLocalMoveItems(initialItems ?? []);
  };

  const addMoveItem = useCallback((item: MoveItemInput) => {
    setLocalMoveItems((prev) => [...prev, item]);
  }, []);

  const updateMoveItem = useCallback(
    (index: number, patch: Partial<MoveItemInput>) => {
      setLocalMoveItems((prev) =>
        prev.map((it, i) =>
          i === index ? ({ ...it, ...patch } as MoveItemInput) : it
        )
      );
    },
    []
  );

  const removeMoveItem = useCallback((indices: number | Set<number>) => {
    setLocalMoveItems((prev) => {
      const toRemove = indices instanceof Set ? indices : new Set([indices]);
      return prev.filter((_, i) => !toRemove.has(i));
    });
    setSelectedItemIndices(new Set());
  }, []);

  useEffect(() => {
    if (isEditing) {
      const hasChanges =
        JSON.stringify(localMoveItems) !== JSON.stringify(initialItems ?? []);

      onItemsChange(hasChanges ? localMoveItems : undefined);
    }
  }, [localMoveItems, initialItems, isEditing, onItemsChange]);

  return (
    <div>
      <SectionHeader
        title="Inventory"
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onCancelEdit={() => setIsEditing(false)}
        className="mx-auto"
      />

      <AddedItems
        hideTitle={true}
        moveItems={isEditing ? localMoveItems : initialItems}
        updateMoveItem={updateMoveItem}
        removeMoveItem={removeMoveItem}
        selectedItemIndices={selectedItemIndices}
        setSelectedItemIndices={setSelectedItemIndices}
        selectedRoom={selectedRoom}
        addMoveItem={addMoveItem}
        isEditing={isEditing}
      />

      {isEditing && (
        <SectionContainer className="px-0">
          <SelectionInventory
            selectedItemIndices={selectedItemIndices}
            setSelectedItemIndices={setSelectedItemIndices}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            updateMoveItem={updateMoveItem}
            removeMoveItem={removeMoveItem}
            addMoveItem={addMoveItem}
            moveItems={localMoveItems}
            roomOptions={rooms}
            itemOptions={items}
            categoryOptions={categories}
          />
        </SectionContainer>
      )}
    </div>
  );
};

export default EditableQuoteInventory;
