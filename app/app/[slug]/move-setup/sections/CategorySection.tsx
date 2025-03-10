"use client";

import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { CategorySchema } from "@/types/convex-schemas";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import CategoryModal from "../modals/CategoryModal";
import { FrontEndErrorMessages } from "@/types/errors";
import CategoryTree from "./CategoryTree";

interface CategorySectionProps {
  categories: CategorySchema[];
  companyId: Id<"companies">;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  companyId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySchema | null>(null);
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
    setExpandedCategories(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // Collapse if already expanded
          : [...prev, categoryId] // Expand otherwise
    );
  };

  const handleOpenCreateModal = (parentCategory: Id<"categories"> | null) => {
    setIsEditMode(false);
    setSelectedCategory(null);
    setParentForNewCategory(parentCategory);
    setIsModalOpen(true);
    setCreateCategoryError(null);
  };

  const handleOpenEditModal = (category: CategorySchema) => {
    setIsEditMode(true);
    setSelectedCategory(category);
    setIsModalOpen(true);
    setUpdateCategoryError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setParentForNewCategory(null);
  };

  const handleOpenDeleteModal = (categoryId: Id<"categories">) => {
    setIsDeleteModalOpen(true);
    setCategoryToDelete(categoryId);
    setDeleteCategoryError(null);
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Categories</h2>

      {/* Top-level categories */}
      {categories.map((category) => (
        <CategoryTree
          key={category._id}
          category={category}
          expandedCategories={expandedCategories}
          onCategoryClick={handleCategoryClick}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onAddCategory={handleOpenCreateModal}
        />
      ))}

      {/* Top-level add category button */}
      <button
        onClick={() => handleOpenCreateModal(null)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New Category
      </button>

      {/* Create/Edit Modal */}
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

      {/* Delete Confirmation Modal */}
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
    </div>
  );
};

export default CategorySection;
