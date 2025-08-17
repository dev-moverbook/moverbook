"use client";

import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import CategoryModal from "../modals/CategoryModal";
import { FrontEndErrorMessages } from "@/types/errors";
import CategoryTree from "../sections/CategoryTree";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/SectionContainer";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";

interface CategoryTabProps {
  categories: Doc<"categories">[];
  companyId: Id<"companies">;
  isEditMode: boolean;
  isDeleteMode: boolean;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
  categories,
  companyId,
  isEditMode,
  isDeleteMode,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] =
    useState<Doc<"categories"> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Id<"categories"> | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Id<"categories">[]
  >([]);
  const [parentForNewCategory, setParentForNewCategory] =
    useState<Id<"categories"> | null>(null);

  const {
    createCategory,
    createCategoryLoading,
    createCategoryError,
    setCreateCategoryError,
  } = useCreateCategory();

  const {
    updateCategory,
    updateCategoryLoading,
    updateCategoryError,
    setUpdateCategoryError,
  } = useUpdateCategory();

  const {
    deleteCategory,
    deleteCategoryLoading,
    deleteCategoryError,
    setDeleteCategoryError,
  } = useDeleteCategory();

  const handleCategoryClick = (categoryId: Id<"categories">) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleOpenDeleteModal = (categoryId: Id<"categories">) => {
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  const handleOpenCreateModal = (parentCategory: Id<"categories"> | null) => {
    setSelectedCategory(null);
    setParentForNewCategory(parentCategory);
    setIsModalOpen(true);
    setCreateCategoryError(null);
  };

  const handleOpenEditModal = (category: Doc<"categories">) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
    setUpdateCategoryError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setParentForNewCategory(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) {
      setDeleteCategoryError(FrontEndErrorMessages.NO_CATEGORY_SELECTED);
      return;
    }

    const success = await deleteCategory(categoryToDelete);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SingleCardContainer>
          <SelectableCardContainer
            onClick={() => handleOpenCreateModal(null)}
            centerText="CATEGORY"
            showPlusIcon={true}
          />
          {categories
            .filter((category) => !category.parentCategory) // only top-level
            .map((category) => (
              <CategoryTree
                key={category._id}
                category={category}
                allCategories={categories}
                expandedCategories={expandedCategories}
                onCategoryClick={handleCategoryClick}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onAddCategory={handleOpenCreateModal}
                showEditIcon={isEditMode}
                showDeleteIcon={isDeleteMode}
              />
            ))}
        </SingleCardContainer>
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreate={(companyId, categoryData) =>
            createCategory(companyId, {
              ...categoryData,
              parentCategory: parentForNewCategory ?? undefined,
            })
          }
          onEdit={updateCategory}
          loading={isEditMode ? updateCategoryLoading : createCategoryLoading}
          error={isEditMode ? updateCategoryError : createCategoryError}
          companyId={companyId}
          initialData={selectedCategory}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleteLoading={deleteCategoryLoading}
          deleteError={deleteCategoryError}
          title="Confirm Delete"
          description="Are you sure you want to delete this category? This action cannot be undone."
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default CategoryTab;
