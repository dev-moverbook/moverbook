"use client";

import React from "react";
import { FeeSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import IconRow from "@/app/components/shared/IconRow";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import FieldDisplay from "@/app/components/shared/FieldDisplay";

interface FeeCardProps {
  fee: FeeSchema;
  onEdit: (fee: FeeSchema) => void;
  onDelete: (feeId: Id<"fees">) => void;
}

const FeeCard: React.FC<FeeCardProps> = ({ fee, onEdit, onDelete }) => {
  return (
    <div className="w-full flex justify-between items-start">
      <div className="space-y-4">
        <FieldDisplay label="Name" value={fee.name} />
        <FieldDisplay label="Price" value={fee.price.toString()} />
      </div>
      <IconRow>
        <IconButton
          onClick={() => onEdit(fee)}
          icon={<Pencil className="w-4 h-4" />}
          title="Edit"
        />
        <IconButton
          onClick={() => onDelete(fee._id)}
          icon={<Trash2 className="w-4 h-4" />}
          variant="outline"
          title="Delete"
        />
      </IconRow>
    </div>
  );
};

export default FeeCard;
