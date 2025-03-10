"use client";

import React from "react";
import { ItemSchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface ItemCardProps {
  item: ItemSchema;
  onEdit: (item: ItemSchema) => void;
  onDelete: (itemId: Id<"items">) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded shadow-sm space-y-2 bg-white">
      <p>
        <span className="font-medium">Name:</span> {item.name}
      </p>
      <p>
        <span className="font-medium">Size:</span> {item.size}
      </p>
      <p>
        <span className="font-medium">Status:</span>{" "}
        {item.isActive ? "Active" : "Inactive"}
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex space-x-2">
        <Button onClick={() => onEdit(item)} className="mt-2">
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(item._id)}
          className="mt-2 bg-red-500 hover:bg-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ItemCard;
