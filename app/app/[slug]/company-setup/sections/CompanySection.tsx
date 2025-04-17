"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CompanySchema } from "@/types/convex-schemas";
import { UpdateCompanyData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import { fetchTimezones } from "@/app/frontendUtils/apis";
import SelectFieldRow from "@/app/components/shared/SelectFieldRow";

interface CompanySectionProps {
  company: CompanySchema;
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

  const [timezoneOptions, setTimezoneOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadTimezones = async () => {
      try {
        const zones = await fetchTimezones();
        setTimezoneOptions(zones);
      } catch (error) {
        console.error("Failed to load timezones:", error);
        setTimezoneOptions(["UTC"]);
      }
    };

    loadTimezones();
  }, []);

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

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Info"
          isEditing={isEditing}
          onEditClick={handleEditClick}
        />

        <div className="flex md:flex-row flex-col items-start md:space-x-8 space-y-4 md:space-y-0">
          {/* Company Image */}
          <div className="relative">
            <Image
              src={company.imageUrl || "/default-company-logo.png"}
              alt="Company Logo"
              className="w-24 h-24 rounded-md object-cover"
              width={120}
              height={120}
            />

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

          <FieldGroup>
            <FieldRow
              label="Company Name"
              name="name"
              value={formData.name}
              isEditing={isEditing}
              onChange={handleChange}
            />

            {timezoneOptions.length > 0 ? (
              <SelectFieldRow
                label="Time Zone"
                name="timeZone"
                value={formData.timeZone}
                options={timezoneOptions}
                isEditing={isEditing}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    timeZone: value,
                  }))
                }
              />
            ) : (
              <FieldRow
                label="Time Zone"
                name="timeZone"
                value="Loading..."
                isEditing={false}
              />
            )}

            {isEditing && (
              <FormActions
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={updateLoading}
                error={updateError}
              />
            )}
          </FieldGroup>
        </div>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default CompanySection;
