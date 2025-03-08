"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComplianceSchema } from "@/types/convex-schemas";
import { Label } from "@/components/ui/label";
import { ComplianceFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";

interface ComplianceSectionProps {
  compliance: ComplianceSchema;
  updateCompliance: (
    complianceId: Id<"compliance">,
    updates: ComplianceFormData
  ) => Promise<boolean>;
  updateLoading: boolean;
  updateError: string | null;
  setUpdateError: (error: string | null) => void;
}

const ComplianceSection: React.FC<ComplianceSectionProps> = ({
  compliance,
  updateCompliance,
  updateLoading,
  updateError,
  setUpdateError,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ComplianceFormData>({
    statePucPermitNumber: compliance.statePucPermitNumber || "",
    dmvNumber: compliance.dmvNumber || "",
    usDotNumber: compliance.usDotNumber || "",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      statePucPermitNumber: compliance.statePucPermitNumber || "",
      dmvNumber: compliance.dmvNumber || "",
      usDotNumber: compliance.usDotNumber || "",
    });
    setUpdateError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const success = await updateCompliance(compliance._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Compliance Information</h2>

      {updateError && <p className="text-red-500">{updateError}</p>}

      {!isEditing ? (
        <div className="space-y-2">
          <p>
            <span className="font-medium">State PUC Permit Number:</span>{" "}
            {compliance.statePucPermitNumber || "N/A"}
          </p>
          <p>
            <span className="font-medium">DMV Number:</span>{" "}
            {compliance.dmvNumber || "N/A"}
          </p>
          <p>
            <span className="font-medium">US DOT Number:</span>{" "}
            {compliance.usDotNumber || "N/A"}
          </p>

          <Button onClick={handleEditClick}>Edit</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <Label className="block text-sm font-medium">
              State PUC Permit Number
            </Label>
            <Input
              type="text"
              name="statePucPermitNumber"
              value={formData.statePucPermitNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">DMV Number</Label>
            <Input
              type="text"
              name="dmvNumber"
              value={formData.dmvNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">US DOT Number</Label>
            <Input
              type="text"
              name="usDotNumber"
              value={formData.usDotNumber}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={updateLoading}>
              {updateLoading ? "Saving..." : "Save"}
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

export default ComplianceSection;
