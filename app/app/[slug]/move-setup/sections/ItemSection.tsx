"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ItemSchema } from "@/types/convex-schemas";
import { ResponseStatus } from "@/types/enums";
import RenderSkeleton from "@/app/components/shared/RenderSkeleton";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import ItemCard from "../cards/ItemCard";
import ItemModal from "../modals/ItemModal";
import { useCreateItem } from "../hooks/useCreateItem";
import { useUpdateItem } from "../hooks/useUpdateItem";
import { useDeleteItem } from "../hooks/useDeleteItem";
import { Button } from "@/app/components/ui/button";

interface ItemSectionProps {
  companyId: Id<"companies">;
  categoryId: Id<"categories">;
}

const ItemSection: React.FC<ItemSectionProps> = ({ companyId, categoryId }) => {
  // Fetch items for the category
  const itemsQuery = useQuery(api.items.getItemsByCategory, {
    companyId,
    categoryId,
  });

  const hasItems =
    itemsQuery?.status === ResponseStatus.SUCCESS &&
    itemsQuery.data.items.length > 0;

  // State for item modal
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemSchema | null>(null);

  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Id<"items"> | null>(null);

  // CRUD hooks
  const { createItem, createItemLoading, createItemError } = useCreateItem();
  const { updateItem, updateItemLoading, updateItemError } = useUpdateItem();
  const { deleteItem, deleteItemLoading, deleteItemError } = useDeleteItem();

  // Handlers
  const handleOpenItemModal = () => {
    setIsItemModalOpen(true);
    setSelectedItem(null);
    setIsEditMode(false);
  };

  const handleEditItem = (item: ItemSchema) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setIsItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenDeleteModal = (itemId: Id<"items">) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const success = await deleteItem(itemToDelete);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <div className="ml-6 mt-2 border-l-2 pl-4 space-y-2">
      <h3 className="text-md font-semibold">Items</h3>

      {!itemsQuery && <RenderSkeleton />}
      {itemsQuery && itemsQuery.status === ResponseStatus.ERROR && (
        <ErrorComponent message={itemsQuery.error} />
      )}

      {hasItems &&
        itemsQuery.data.items.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            onEdit={handleEditItem}
            onDelete={handleOpenDeleteModal}
          />
        ))}

      {!hasItems && (
        <p className="text-gray-500">No items found in this category.</p>
      )}

      {/* Add Item Button */}
      <Button
        onClick={handleOpenItemModal}
        className="mt-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        + Add Item
      </Button>

      {/* Item Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={handleCloseItemModal}
        onCreate={createItem}
        onEdit={updateItem}
        loading={isEditMode ? updateItemLoading : createItemLoading}
        error={isEditMode ? updateItemError : createItemError}
        companyId={companyId}
        categoryId={categoryId}
        initialData={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleteLoading={deleteItemLoading}
        deleteError={deleteItemError}
        title="Confirm Delete"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default ItemSection;
