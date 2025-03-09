"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateCreditCardFee } from "../hooks/useUpdateCreditCardFee";
import { CreditCardFeeSchema } from "@/types/convex-schemas";

interface CreditCardFeeSectionProps {
  creditCardFee: CreditCardFeeSchema;
}

const CreditCardFeeSection: React.FC<CreditCardFeeSectionProps> = ({
  creditCardFee,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<number>(creditCardFee.rate);

  const {
    updateCreditCardFee,
    updateCreditCardFeeLoading,
    updateCreditCardFeeError,
    setUpdateCreditCardFeeError,
  } = useUpdateCreditCardFee();

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateCreditCardFeeError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(parseFloat(value));
  };

  const handleSave = async () => {
    if (formData === undefined) return;

    const success = await updateCreditCardFee(creditCardFee._id, {
      rate: formData,
    });

    if (success) {
      setIsEditing(false); // Exit edit mode on success
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Exit edit mode without saving changes
    setFormData(creditCardFee.rate); // Reset form data to original value
  };

  return (
    <div className="p-4 border rounded shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Credit Card Fee</h2>

      {isEditing ? (
        <div className="flex flex-col space-y-2 w-full">
          {/* Inline editing field */}
          <Input
            type="number"
            value={formData || ""}
            onChange={handleInputChange}
            placeholder="Enter fee rate"
          />
          <div className="flex space-x-2 mt-2">
            <Button onClick={handleSave} disabled={updateCreditCardFeeLoading}>
              {updateCreditCardFeeLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          {updateCreditCardFeeError && (
            <p className="text-red-500 text-sm mt-2">
              {updateCreditCardFeeError}
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Display fee details */}
          <p>
            <span className="font-medium">Rate:</span> {creditCardFee.rate}%
          </p>
          <Button onClick={handleEditClick}>Edit</Button>
        </>
      )}
    </div>
  );
};

export default CreditCardFeeSection;
