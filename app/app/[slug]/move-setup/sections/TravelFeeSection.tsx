"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TravelChargingTypes } from "@/types/enums";
import { useUpdateTravelFee } from "../hooks/useUpdateTravelFee";
import { TravelFeeSchema } from "@/types/convex-schemas";
import { TravelFeeFormData } from "@/types/form-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TravelFeeSectionProps {
  travelFee: TravelFeeSchema;
}

const TravelFeeSection: React.FC<TravelFeeSectionProps> = ({ travelFee }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<TravelFeeFormData>(travelFee);

  const {
    updateTravelFee,
    updateTravelFeeLoading,
    updateTravelFeeError,
    setUpdateTravelFeeError,
  } = useUpdateTravelFee();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const handleChargingMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      chargingMethod: value as TravelChargingTypes,
    }));
  };

  const handleSave = async () => {
    setUpdateTravelFeeError(null);

    const success = await updateTravelFee(travelFee._id, {
      isDefault: formData.isDefault,
      chargingMethod: formData.chargingMethod,
      rate: formData.rate,
    });

    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Travel Fee</h2>

      {!isEditing ? (
        <>
          <p>
            <span className="font-medium">Charging Method:</span>{" "}
            {formData.chargingMethod}
          </p>
          <p>
            <span className="font-medium">Rate:</span>{" "}
            {formData.rate ? `$${formData.rate}` : "Not Applicable"}
          </p>
          <p>
            <span className="font-medium">Default:</span>{" "}
            {formData.isDefault ? "Yes" : "No"}
          </p>

          <Button onClick={() => setIsEditing(true)} className="mt-2">
            Edit
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-4">
            {/* Charging Method */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chargingMethod" className="text-right">
                Charging Method
              </Label>
              <Select
                value={formData.chargingMethod}
                onValueChange={handleChargingMethodChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select charging method" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TravelChargingTypes).map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rate */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">
                Rate
              </Label>
              <Input
                id="rate"
                name="rate"
                type="number"
                value={formData.rate || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isDefault">Is Default</Label>
            </div>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex space-x-2 mt-4">
            <Button onClick={handleSave} disabled={updateTravelFeeLoading}>
              {updateTravelFeeLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>

          {/* Error Message */}
          {updateTravelFeeError && (
            <p className="text-red-500 text-sm mt-2">{updateTravelFeeError}</p>
          )}
        </>
      )}
    </div>
  );
};

export default TravelFeeSection;
