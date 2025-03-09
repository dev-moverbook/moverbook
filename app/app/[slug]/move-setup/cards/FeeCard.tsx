"use client";

import React from "react";
import { FeeSchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface FeeCardProps {
  fee: FeeSchema;
  onEdit: (fee: FeeSchema) => void;
  onDelete: (feeId: Id<"fees">) => void;
}

const FeeCard: React.FC<FeeCardProps> = ({ fee, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded shadow-sm space-y-2">
      <p>
        <span className="font-medium">Name:</span> {fee.name}
      </p>
      <p>
        <span className="font-medium">Price:</span> ${fee.price}
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex space-x-2">
        <Button onClick={() => onEdit(fee)} className="mt-2">
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(fee._id)}
          className="mt-2 bg-red-500 hover:bg-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default FeeCard;
