"use client";

import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { CategorySchema } from "@/types/convex-schemas";
import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";

interface CategoryTreeProps {
  category: CategorySchema;
  allCategories: CategorySchema[];
  expandedCategories: Id<"categories">[];
  onCategoryClick: (categoryId: Id<"categories">) => void;
  onEdit: (category: CategorySchema) => void;
  onDelete: (categoryId: Id<"categories">) => void;
  onAddCategory: (parentCategory: Id<"categories">) => void;
  showEditIcon?: boolean;
  showDeleteIcon?: boolean;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  category,
  allCategories,
  expandedCategories,
  onCategoryClick,
  onEdit,
  onDelete,
  onAddCategory,
  showEditIcon,
  showDeleteIcon,
}) => {
  const isExpanded = expandedCategories.includes(category._id);

  const childCategories = allCategories.filter(
    (c) => c.parentCategory === category._id
  );

  return (
    <div className="ml-2">
      <SelectableCardContainer
        id={category._id}
        centerText={category.name}
        onClick={
          !showEditIcon && !showDeleteIcon
            ? () => onCategoryClick(category._id)
            : undefined
        }
        onEdit={showEditIcon ? () => onEdit(category) : undefined}
        onDelete={showDeleteIcon ? () => onDelete(category._id) : undefined}
        showEditIcon={showEditIcon}
        showDeleteIcon={showDeleteIcon}
      />

      {isExpanded &&
        childCategories.map((child) => (
          <CategoryTree
            key={child._id}
            category={child}
            allCategories={allCategories}
            expandedCategories={expandedCategories}
            onCategoryClick={onCategoryClick}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddCategory={onAddCategory}
            showEditIcon={showEditIcon}
            showDeleteIcon={showDeleteIcon}
          />
        ))}
    </div>
  );
};

export default CategoryTree;
