"use client";

import { useState } from "react";
import { ComplianceFormData } from "@/types/form-types";
import { Doc, Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FieldRow from "@/components/shared/field/FieldRow";
import FormActions from "@/components/shared/buttons/FormActions";

interface ComplianceSectionProps {
  compliance: Doc<"compliances">;
  updateCompliance: (
    complianceId: Id<"compliances">,
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

  const hasNoChanges =
    formData.statePucPermitNumber === compliance.statePucPermitNumber &&
    formData.dmvNumber === compliance.dmvNumber &&
    formData.usDotNumber === compliance.usDotNumber;

  const isFormEmpty =
    formData.statePucPermitNumber.trim() === "" &&
    formData.dmvNumber.trim() === "" &&
    formData.usDotNumber.trim() === "";

  const isDisabled = isEditing && hasNoChanges && !isFormEmpty;

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
              disabled={isDisabled}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ComplianceSection;
