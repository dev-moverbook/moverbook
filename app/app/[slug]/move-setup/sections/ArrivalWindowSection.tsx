"use client";

import React, { useState } from "react";
import { ArrivalWindowSchema } from "@/types/convex-schemas";
import { useUpdateArrivalWindow } from "../hooks/useUpdateArrivalWindow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { ArrivalWindowFormData } from "@/types/form-types";

interface ArrivalWindowSectionProps {
  arrivalWindow: ArrivalWindowSchema;
}

const ArrivalWindowSection: React.FC<ArrivalWindowSectionProps> = ({
  arrivalWindow,
}) => {
  const {
    updateArrivalWindow,
    updateArrivalWindowLoading,
    updateArrivalWindowError,
    setUpdateArrivalWindowError,
  } = useUpdateArrivalWindow();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ArrivalWindowFormData>({
    morningArrival: arrivalWindow.morningArrival,
    morningEnd: arrivalWindow.morningEnd,
    afternoonArrival: arrivalWindow.afternoonArrival,
    afternoonEnd: arrivalWindow.afternoonEnd,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value) || 0,
    }));
  };

  const handleSave = async () => {
    const success = await updateArrivalWindow(arrivalWindow._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      morningArrival: arrivalWindow.morningArrival,
      morningEnd: arrivalWindow.morningEnd,
      afternoonArrival: arrivalWindow.afternoonArrival,
      afternoonEnd: arrivalWindow.afternoonEnd,
    });
    setUpdateArrivalWindowError(null);
    setIsEditing(false);
  };

  return (
    <div className="p-4 border rounded-md shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Arrival Window</h2>

      {updateArrivalWindowError && (
        <p className="text-red-500">{updateArrivalWindowError}</p>
      )}

      {!isEditing ? (
        <div className="space-y-2">
          <p>
            <span className="font-medium">Morning Arrival:</span>{" "}
            {arrivalWindow.morningArrival} AM
          </p>
          <p>
            <span className="font-medium">Morning End:</span>{" "}
            {arrivalWindow.morningEnd} AM
          </p>
          <p>
            <span className="font-medium">Afternoon Arrival:</span>{" "}
            {arrivalWindow.afternoonArrival} PM
          </p>
          <p>
            <span className="font-medium">Afternoon End:</span>{" "}
            {arrivalWindow.afternoonEnd} PM
          </p>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <Label className="block text-sm font-medium">
              Morning Arrival (AM)
            </Label>
            <Input
              type="number"
              name="morningArrival"
              value={formData.morningArrival}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">
              Morning End (AM)
            </Label>
            <Input
              type="number"
              name="morningEnd"
              value={formData.morningEnd}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">
              Afternoon Arrival (PM)
            </Label>
            <Input
              type="number"
              name="afternoonArrival"
              value={formData.afternoonArrival}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">
              Afternoon End (PM)
            </Label>
            <Input
              type="number"
              name="afternoonEnd"
              value={formData.afternoonEnd}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={updateArrivalWindowLoading}>
              {updateArrivalWindowLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArrivalWindowSection;
