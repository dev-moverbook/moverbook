import Header3 from "@/app/components/shared/heading/Header3";
import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import GroupedItemsList from "../lists/GroupedItemList";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import EditItemsModal from "../modals/EditItemsModal";
import { Button } from "@/app/components/ui/button";
import AddItemModal from "../modals/AddItemModal";
import { MoveItemInput } from "@/types/form-types";

interface AddedItemsProps {
  selectedItemIndices: Set<number>;
  setSelectedItemIndices: React.Dispatch<React.SetStateAction<Set<number>>>;
  selectedRoom: string | null;
  moveItems: MoveItemInput[];
  updateMoveItem: (index: number, updates: Partial<MoveItemInput>) => void;
  removeMoveItem: (index: number) => void;
  addMoveItem: (item: MoveItemInput) => void;
  isEditing?: boolean;
}

const AddedItems = ({
  selectedItemIndices,
  setSelectedItemIndices,
  selectedRoom,
  moveItems,
  updateMoveItem,
  removeMoveItem,
  addMoveItem,
  isEditing,
}: AddedItemsProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState<boolean>(false);

  const handleToggle = (index: number) => {
    setSelectedItemIndices((prev: Set<number>) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const handleDeleteConfirm = () => {
    Array.from(selectedItemIndices).forEach((index) => removeMoveItem(index));
    setSelectedItemIndices(new Set());
    setDeleteModalOpen(false);
  };

  const handleEditSubmit = (newQuantity: number) => {
    Array.from(selectedItemIndices).forEach((index) =>
      updateMoveItem(index, { quantity: newQuantity })
    );
    setSelectedItemIndices(new Set());
    setEditModalOpen(false);
  };

  const handleQuickAdd = () => {
    setQuickAddModalOpen(true);
  };

  return (
    <SectionContainer>
      {isEditing && (
        <Header3
          button={
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleQuickAdd();
              }}
            >
              Quick Add
            </Button>
          }
          showCheckmark={false}
        >
          Added Items
        </Header3>
      )}

      <GroupedItemsList
        items={moveItems}
        selectedItemIndices={selectedItemIndices}
        onToggle={handleToggle}
        isEditing={isEditing}
      />

      <ConfirmModal
        title="Are you sure you want to delete these items?"
        description="This action cannot be undone."
        onClose={() => setDeleteModalOpen(false)}
        isOpen={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        deleteLoading={false}
        deleteError={null}
      />

      <EditItemsModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <AddItemModal
        isOpen={quickAddModalOpen}
        onClose={() => setQuickAddModalOpen(false)}
        selectedRoom={selectedRoom}
        addMoveItem={addMoveItem}
      />
    </SectionContainer>
  );
};

export default AddedItems;
