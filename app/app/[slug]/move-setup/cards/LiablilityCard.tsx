"use client";

import React from "react";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface LiabilityCardProps {
  policy: InsurancePolicySchema;
  onEdit: (policy: InsurancePolicySchema) => void;
  onDelete: (policyId: Id<"insurancePolicies">) => void;
}

const LiabilityCard: React.FC<LiabilityCardProps> = ({
  policy,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 border rounded shadow-sm space-y-2">
      <p>
        <span className="font-medium">Name:</span> {policy.name}
      </p>
      <p>
        <span className="font-medium">Coverage Amount:</span> $
        {policy.coverageAmount}
      </p>
      <p>
        <span className="font-medium">Premium:</span> ${policy.premium}
      </p>
      <p>
        <span className="font-medium">Coverage Type:</span>{" "}
        {policy.coverageType}
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex space-x-2">
        <Button onClick={() => onEdit(policy)} className="mt-2">
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(policy._id)}
          className="mt-2 bg-red-500 hover:bg-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default LiabilityCard;
