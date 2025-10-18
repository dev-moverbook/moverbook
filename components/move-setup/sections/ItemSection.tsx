"use client";

import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import ConfirmModal from "@/components/shared/ConfirmModal";
import ItemModal from "../modals/ItemModal";
import { useCreateItem } from "../hooks/useCreateItem";
import { useUpdateItem } from "../hooks/useUpdateItem";
import { useDeleteItem } from "../hooks/useDeleteItem";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import TabSelector from "@/components/shared/TabSelector";
import SearchTab from "../tabs/SearchTab";
import PopularTab from "../tabs/PopularTab";
import CategoryTab from "../tabs/CategoryTab";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import IconButton from "@/components/shared/IconButton";
import { X } from "lucide-react";
import CenteredContainer from "@/components/shared/CenteredContainer";

interface ItemSectionProps {
  companyId: Id<"companies">;
  categories: Doc<"categories">[];
  // categoryId: Id<"categories">;
  items: Doc<"items">[];
}

const ItemSection: React.FC<ItemSectionProps> = ({
  companyId,
  categories,
  items,
}) => {
  const [activeTab, setActiveTab] = useState<string>("POPULAR");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  // Fetch items for the category
  // const itemsQuery = useQuery(api.items.getItemsByCategory, {
  //   companyId,
  //   categoryId,
  // });

  // const hasItems =
  //   itemsQuery?.status === ResponseStatus.SUCCESS &&
  //   itemsQuery.data.items.length > 0;

  // State for item modal
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Doc<"items"> | null>(null);

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

  const handleEditItem = (item: Doc<"items">) => {
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
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          className="px-0 pb-4"
          title="Items"
          actions={
            <div className="flex gap-2">
              <IconButton
                onClick={() => setIsEditMode(!isEditMode)}
                icon={
                  isEditMode ? (
                    <X className="w-4 h-4 " />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )
                }
                title={isEditMode ? "Cancel Edit" : "Edit Items"}
                disabled={isDeleteMode}
              />
              <IconButton
                onClick={() => setIsDeleteMode(!isDeleteMode)}
                icon={
                  isDeleteMode ? (
                    <X className="w-4 h-4 " />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )
                }
                variant="outline"
                title={isDeleteMode ? "Cancel Delete" : "Delete Items"}
                disabled={isEditMode}
              />
            </div>
          }
        />
        <div className="mb-4">
          <TabSelector
            tabs={["POPULAR", "CATEGORIES", "SEARCH"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        {activeTab === "SEARCH" && (
          <SearchTab
            items={items}
            isEditMode={isEditMode}
            handleEditItem={handleEditItem}
            handleOpenDeleteModal={handleOpenDeleteModal}
            handleOpenItemModal={handleOpenItemModal}
            isDeleteMode={isDeleteMode}
          />
        )}
        {activeTab === "POPULAR" && (
          <PopularTab
            items={items}
            isEditMode={isEditMode}
            handleEditItem={handleEditItem}
            handleOpenDeleteModal={handleOpenDeleteModal}
            isDeleteMode={isDeleteMode}
            handleOpenItemModal={handleOpenItemModal}
          />
        )}
        {activeTab === "CATEGORIES" && (
          <CategoryTab
            companyId={companyId}
            categories={categories}
            isEditMode={isEditMode}
            isDeleteMode={isDeleteMode}
          />
        )}

        {/* {!itemsQuery && <RenderSkeleton />}
      {itemsQuery && itemsQuery.status === ResponseStatus.ERROR && (
        <ErrorComponent message={itemsQuery.error} />
      )} */}

        {/* {hasItems &&
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
      )} */}

        {/* Add Item Button */}

        {/* Item Modal */}
        <ItemModal
          isOpen={isItemModalOpen}
          onClose={handleCloseItemModal}
          onCreate={createItem}
          onEdit={updateItem}
          loading={isEditMode ? updateItemLoading : createItemLoading}
          error={isEditMode ? updateItemError : createItemError}
          companyId={companyId}
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
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ItemSection;
