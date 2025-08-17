"use client";

import React, { useState, useCallback, useEffect } from "react";
import SectionHeader from "@/app/components/shared/SectionHeader";
import AddedItems from "@/app/app/[slug]/add-move/components/sections/AddedItems";
import SelectionInventory from "@/app/app/[slug]/add-move/components/sections/SelectionInventory";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { Doc } from "@/convex/_generated/dataModel";
import { MoveItemInput } from "@/types/form-types";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import FormActions from "@/app/components/shared/FormActions";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";

interface InventorySectionProps {
  items: Doc<"items">[];
  categories: Doc<"categories">[];
  rooms: Doc<"rooms">[];
}

const InventorySection = ({
  items,
  categories,
  rooms,
}: InventorySectionProps) => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedItemIndices, setSelectedItemIndices] = useState<Set<number>>(
    new Set()
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const [localMoveItems, setLocalMoveItems] = useState<MoveItemInput[]>(
    move.moveItems ?? []
  );

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  useEffect(() => {
    if (!isEditing) {
      setLocalMoveItems(move.moveItems ?? []);
    }
  }, [move.moveItems, isEditing]);

  const handleEditClick = () => {
    if (!isEditing) {
      setLocalMoveItems(move.moveItems ?? []);
      setSelectedItemIndices(new Set());
    }
    setIsEditing((v) => !v);
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

  const handleSave = useCallback(async () => {
    const { success } = await updateMove({
      moveId: move._id,
      updates: { moveItems: localMoveItems },
    });
    if (success) {
      setIsEditing(false);
      setSelectedItemIndices(new Set());
    }
  }, [updateMove, move._id, localMoveItems]);

  const handleCancel = useCallback(() => {
    setLocalMoveItems(move.moveItems ?? []);
    setSelectedItemIndices(new Set());
    setIsEditing(false);
  }, [move.moveItems]);

  return (
    <div>
      <SectionHeader
        title="Inventory"
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onCancelEdit={() => setIsEditing(false)}
        className="mx-auto"
      />

      <>
        <AddedItems
          hideTitle={true}
          // Show live local edits while editing; otherwise show persisted data
          moveItems={isEditing ? localMoveItems : move.moveItems}
          updateMoveItem={updateMoveItem}
          removeMoveItem={removeMoveItem}
          selectedItemIndices={selectedItemIndices}
          setSelectedItemIndices={setSelectedItemIndices}
          selectedRoom={selectedRoom}
          addMoveItem={addMoveItem}
          isEditing={isEditing}
        />

        {isEditing && (
          <SectionContainer>
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
            <FormActionContainer>
              <FormActions
                isSaving={updateMoveLoading}
                error={updateMoveError || undefined}
                onCancel={handleCancel}
                onSave={(e) => {
                  e?.preventDefault();
                  void handleSave();
                }}
              />
            </FormActionContainer>
          </SectionContainer>
        )}
      </>
    </div>
  );
};

export default InventorySection;
