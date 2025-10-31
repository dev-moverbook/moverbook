"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { UpdateCompanyData } from "@/types/form-types";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import FormActions from "@/components/shared/buttons/FormActions";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FieldRow from "@/components/shared/field/FieldRow";
import { TIMEZONE_OPTIONS } from "@/types/const";
import SelectFieldRow from "@/components/shared/field/SelectFieldRow";

interface CompanySectionProps {
  company: Doc<"companies">;
  updateCompany: (
    companyId: Id<"companies">,
    updates: UpdateCompanyData
  ) => Promise<{ success: boolean; newSlug?: string }>;
  updateLoading: boolean;
  updateError: string | null;
  setUpdateError: (error: string | null) => void;
  uploadOrganizationLogo: (
    companyId: Id<"companies">,
    file: File
  ) => Promise<boolean>;
  uploadLoading: boolean;
  uploadError: string | null;
}

const CompanySection: React.FC<CompanySectionProps> = ({
  company,
  updateCompany,
  updateLoading,
  updateError,
  setUpdateError,
  uploadOrganizationLogo,
  uploadLoading,
  uploadError,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateCompanyData>({
    name: company.name || "",
    timeZone: company.timeZone || "UTC",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: company.name || "",
      timeZone: company.timeZone || "UTC",
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
    const { success, newSlug } = await updateCompany(company._id, formData);
    if (success) {
      setIsEditing(false);
      if (newSlug) {
        window.location.href = `/app/${newSlug}/company-setup`;
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await uploadOrganizationLogo(company._id, file);
  };

  const isDisabled = !formData.name || !formData.timeZone;

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Info"
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onCancelEdit={handleCancel}
          className="px-0 pb-4"
        />

        <div className="flex md:flex-row flex-col items-start md:space-x-8 space-y-4 md:space-y-0">
          {/* Company Image */}
          <div className="relative">
            {company.imageUrl ? (
              <Image
                src={company.imageUrl}
                alt="Company Logo"
                className="w-24 h-24 rounded-md object-cover"
                width={120}
                height={120}
                priority
              />
            ) : (
              <div className="w-24 h-24 rounded-md border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                  />
                </svg>
              </div>
            )}

            {isEditing && (
              <>
                <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">Change</span>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  disabled={uploadLoading}
                />
                {uploadError && (
                  <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                )}
              </>
            )}
          </div>

          <FieldGroup className="w-full">
            <FieldRow
              label="Company Name"
              name="name"
              value={formData.name}
              isEditing={isEditing}
              onChange={handleChange}
            />

            <SelectFieldRow
              label="Time Zone"
              name="timeZone"
              value={formData.timeZone}
              options={TIMEZONE_OPTIONS}
              isEditing={isEditing}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  timeZone: value,
                }))
              }
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
        </div>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default CompanySection;
