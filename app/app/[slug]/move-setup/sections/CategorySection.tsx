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
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { Button } from "@/app/components/ui/button";
import ToggleTabs from "@/app/components/shared/ToggleTabs";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";

type CategoryManageMode = "edit" | "delete";

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
  const [manageMode, setManageMode] = useState<CategoryManageMode>("edit");

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
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
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
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Categories"
          actions={
            <div className="flex items-center gap-4">
              {!isEditMode ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                    Edit Categories
                  </Button>
                  <Button onClick={() => handleOpenCreateModal(null)}>
                    + Add Category
                  </Button>
                </>
              ) : (
                <>
                  <ToggleTabs<CategoryManageMode>
                    value={manageMode}
                    onChange={(mode) => setManageMode(mode)}
                    options={[
                      { label: "Edit", value: "edit" },
                      { label: "Delete", value: "delete" },
                    ]}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      setManageMode("edit");
                    }}
                  >
                    Done
                  </Button>
                </>
              )}
            </div>
          }
        />
        <SingleCardContainer>
          {categories.map((category) => (
            <CategoryTree
              key={category._id}
              category={category}
              expandedCategories={expandedCategories}
              onCategoryClick={handleCategoryClick}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onAddCategory={handleOpenCreateModal}
              mode={manageMode}
              showEditIcon={isEditMode}
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

export default CategorySection;
