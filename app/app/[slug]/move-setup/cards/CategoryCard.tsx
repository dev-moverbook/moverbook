"use client";

import React from "react";
import { CategorySchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface CategoryCardProps {
  category: CategorySchema;
  onEdit: (category: CategorySchema) => void;
  onDelete: (categoryId: Id<"categories">) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 border rounded shadow-sm space-y-2 bg-white">
      <p>
        <span className="font-medium">Category Name:</span> {category.name}
      </p>

      <div className="flex space-x-2">
        <Button onClick={() => onEdit(category)} className="mt-2">
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(category._id)}
          className="mt-2 bg-red-500 hover:bg-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CategoryCard;
