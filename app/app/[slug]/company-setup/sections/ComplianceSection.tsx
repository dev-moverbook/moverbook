"use client";

import { useState } from "react";
import { ComplianceSchema } from "@/types/convex-schemas";
import { ComplianceFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";

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
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Compliance"
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onCancelEdit={handleCancel}
          className="px-0 pb-4"
        />

        <FieldGroup>
          <FieldRow
            label="State PUC Permit Number"
            name="statePucPermitNumber"
            value={formData.statePucPermitNumber}
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="Enter state PUC permit number"
          />

          <FieldRow
            label="DMV Number"
            name="dmvNumber"
            value={formData.dmvNumber}
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="Enter DMV number"
          />

          <FieldRow
            label="US DOT Number"
            name="usDotNumber"
            value={formData.usDotNumber}
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="Enter US DOT number"
          />

          {isEditing && (
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onCancel={handleCancel}
              isSaving={updateLoading}
              error={updateError}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ComplianceSection;
