"use client";

import React from "react";
import { LaborSchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface LaborCardProps {
  laborItem: LaborSchema;
  onEdit: (laborItem: LaborSchema) => void;
  onDelete: (laborId: Id<"labor">) => void;
}

const LaborCard: React.FC<LaborCardProps> = ({
  laborItem,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 border rounded shadow-sm space-y-2">
      <p>
        <span className="font-medium">Name:</span> {laborItem.name}
      </p>
      <p>
        <span className="font-medium">2 Movers:</span> ${laborItem.twoMovers}
      </p>
      <p>
        <span className="font-medium">3 Movers:</span> ${laborItem.threeMovers}
      </p>
      <p>
        <span className="font-medium">4 Movers:</span> ${laborItem.fourMovers}
      </p>
      <p>
        <span className="font-medium">Extra Mover:</span> ${laborItem.extra}
      </p>

      {/* Call the onEdit function when Edit button is clicked */}
      <Button onClick={() => onEdit(laborItem)} className="mt-2">
        {" "}
        Edit
      </Button>
      <Button
        variant="destructive"
        onClick={() => onDelete(laborItem._id)}
        className="mt-2 bg-red-500 hover:bg-red-600"
      >
        Delete
      </Button>
    </div>
  );
};

export default LaborCard;
