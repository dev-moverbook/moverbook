"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { VariableSchema } from "@/types/convex-schemas";

interface VariableCardProps {
  variable: VariableSchema;
}

const VariableCard: React.FC<VariableCardProps> = ({ variable }) => {
  return (
    <div className="flex justify-between items-center p-3 border rounded-md shadow-sm">
      <div>
        <p className="font-medium text-lg">{variable.name}</p>
        <p className="text-gray-600 text-sm">
          Default: {variable.defaultValue}
        </p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline">Edit</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  );
};

export default VariableCard;
