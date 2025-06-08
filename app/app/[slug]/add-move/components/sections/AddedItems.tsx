import Header3 from "@/app/components/shared/heading/Header3";
import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import GroupedItemsList from "../lists/GroupedItemList";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import EditItemsModal from "../modals/EditItemsModal";
import { Button } from "@/app/components/ui/button";
import AddItemModal from "../modals/AddItemModal";

interface AddedItemsProps {
  selectedItemIndices: Set<number>;
  setSelectedItemIndices: React.Dispatch<React.SetStateAction<Set<number>>>;
  selectedRoom: string | null;
}

const AddedItems = ({
  selectedItemIndices,
  setSelectedItemIndices,
  selectedRoom,
}: AddedItemsProps) => {
  const { moveItems, updateMoveItem, removeMoveItem } = useMoveForm();
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
    const indices = Array.from(selectedItemIndices);
    indices.forEach((index) => removeMoveItem(index));
    setSelectedItemIndices(new Set());
    setDeleteModalOpen(false);
  };

  const handleEditSubmit = (newQuantity: number) => {
    const indices = Array.from(selectedItemIndices);
    indices.forEach((index) =>
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
          // )
        }
        showCheckmark={false}
      >
        Added Items
      </Header3>

      <GroupedItemsList
        items={moveItems}
        selectedItemIndices={selectedItemIndices}
        onToggle={handleToggle}
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
      />
    </SectionContainer>
  );
};

export default AddedItems;
