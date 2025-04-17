"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CategorySchema } from "@/types/convex-schemas";
import { ResponseStatus } from "@/types/enums";
import RenderSkeleton from "@/app/components/shared/RenderSkeleton";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { Button } from "@/app/components/ui/button";
import ItemSection from "./ItemSection";
import SelectCard from "../cards/RoomCard";

interface CategoryTreeProps {
  category: CategorySchema;
  expandedCategories: Id<"categories">[];
  onCategoryClick: (categoryId: Id<"categories">) => void;
  onEdit: (category: CategorySchema) => void;
  onDelete: (categoryId: Id<"categories">) => void;
  onAddCategory: (parentCategory: Id<"categories">) => void;
  mode?: "edit" | "delete";
  showEditIcon?: boolean;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  category,
  expandedCategories,
  onCategoryClick,
  onEdit,
  onDelete,
  onAddCategory,
  mode,
  showEditIcon,
}) => {
  const isExpanded = expandedCategories.includes(category._id);

  const subcategoriesQuery = useQuery(
    api.categories.getSubcategories,
    isExpanded ? { parentCategory: category._id } : "skip"
  );

  const hasSubcategories =
    subcategoriesQuery?.status === ResponseStatus.SUCCESS &&
    subcategoriesQuery.data.categories.length > 0;

  return (
    <div>
      {/* Parent Category */}
      <div className="" onClick={() => onCategoryClick(category._id)}>
        <SelectCard
          id={category._id}
          label={category.name}
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category._id)}
          mode={mode}
          showEditIcon={showEditIcon}
        />
      </div>

      {/* Subcategories Section - Only Render Skeleton on Click */}
      {isExpanded && (
        <div className="ml-6 border-l-2 pl-4 space-y-2">
          {!subcategoriesQuery && <RenderSkeleton />}
          {subcategoriesQuery &&
            subcategoriesQuery.status === ResponseStatus.ERROR && (
              <ErrorComponent message={subcategoriesQuery.error} />
            )}
          {hasSubcategories &&
            subcategoriesQuery.data.categories.map((subCategory) => (
              <CategoryTree
                key={subCategory._id}
                category={subCategory}
                expandedCategories={expandedCategories}
                onCategoryClick={onCategoryClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddCategory={onAddCategory}
              />
            ))}
        </div>
      )}

      {/* Items Section - Load only if no subcategories exist */}
      {isExpanded &&
        subcategoriesQuery?.status === ResponseStatus.SUCCESS &&
        !hasSubcategories && (
          <ItemSection
            companyId={category.companyId}
            categoryId={category._id}
          />
        )}

      {/* Add Buttons Section */}
      {isExpanded && (
        <div className="ml-6 mt-2 flex space-x-2">
          <Button
            onClick={() => onAddCategory(category._id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Subcategory
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryTree;
