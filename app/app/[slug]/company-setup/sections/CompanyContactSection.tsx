"use client";

import { useState } from "react";
import { CompanyContactSchema } from "@/types/convex-schemas";
import { CompanyContactFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldRow from "@/app/components/shared/FieldRow";
import FieldGroup from "@/app/components/shared/FieldGroup";

interface CompanyContactSectionProps {
  companyContact: CompanyContactSchema;
  updateCompanyContact: (
    companyContactId: Id<"companyContact">,
    updates: CompanyContactFormData
  ) => Promise<boolean>;
  updateLoading: boolean;
  updateError: string | null;
  setUpdateError: (error: string | null) => void;
}

type FieldKey = keyof CompanyContactFormData;

const CompanyContactSection: React.FC<CompanyContactSectionProps> = ({
  companyContact,
  updateCompanyContact,
  updateLoading,
  updateError,
  setUpdateError,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<CompanyContactFormData>({
    email: companyContact.email || "",
    phoneNumber: companyContact.phoneNumber || "",
    address: companyContact.address || "",
    website: companyContact.website || "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<FieldKey, string>>({
    email: "",
    phoneNumber: "",
    address: "",
    website: "",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      email: companyContact.email || "",
      phoneNumber: companyContact.phoneNumber || "",
      address: companyContact.address || "",
      website: companyContact.website || "",
    });
    setUpdateError(null);
    setFieldErrors({
      email: "",
      phoneNumber: "",
      address: "",
      website: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name as FieldKey]: "" }));
  };

  const handleSave = async () => {
    const errors: Record<FieldKey, string> = {
      email: "",
      phoneNumber: "",
      address: "",
      website: "",
    };

    if (!formData.email) errors.email = "Email is required.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required.";
    if (!formData.address) errors.address = "Address is required.";
    if (!formData.website) errors.website = "Website is required.";

    const hasErrors = Object.values(errors).some((msg) => msg !== "");

    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }

    const success = await updateCompanyContact(companyContact._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Company Contact"
          isEditing={isEditing}
          onEditClick={handleEditClick}
        />

        <FieldGroup>
          <FieldRow
            label="Email"
            name="email"
            value={formData.email}
            isEditing={isEditing}
            onChange={handleChange}
            type="email"
            error={fieldErrors.email}
          />

          <FieldRow
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            isEditing={isEditing}
            onChange={handleChange}
            error={fieldErrors.phoneNumber}
          />

          <FieldRow
            label="Address"
            name="address"
            value={formData.address}
            isEditing={isEditing}
            onChange={handleChange}
            error={fieldErrors.address}
          />

          <FieldRow
            label="Website"
            name="website"
            value={formData.website}
            isEditing={isEditing}
            onChange={handleChange}
            error={fieldErrors.website}
          />

          {isEditing && (
            <FormActions
              onSave={handleSave}
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

export default CompanyContactSection;
