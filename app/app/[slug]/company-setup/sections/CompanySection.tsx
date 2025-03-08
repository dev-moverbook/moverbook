"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanySchema } from "@/types/convex-schemas";
import { UpdateCompanyData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

interface CompanySectionProps {
  company: CompanySchema;
  updateCompany: (
    companyId: Id<"companies">,
    updates: UpdateCompanyData
  ) => Promise<boolean>;
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
    const success = await updateCompany(company._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await uploadOrganizationLogo(company._id, file);
  };

  return (
    <div className="p-4 border rounded-md shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Company Information</h2>

      {updateError && <p className="text-red-500">{updateError}</p>}
      {uploadError && <p className="text-red-500">{uploadError}</p>}

      <div className="flex items-center space-x-4">
        {/* Company Image */}
        <div className="relative">
          <Image
            src={company.imageUrl || "/default-company-logo.png"}
            alt="Company Logo"
            className="w-20 h-20 rounded-full border"
            width={20}
            height={20}
          />
          <Input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
            disabled={uploadLoading}
          />
        </div>

        {!isEditing ? (
          <div className="space-y-2">
            <p>
              <span className="font-medium">Company Name:</span> {company.name}
            </p>
            <p>
              <span className="font-medium">Time Zone:</span> {company.timeZone}
            </p>
            <Button onClick={handleEditClick}>Edit</Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Label>Time Zone</Label>
            <Input
              type="text"
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
            />
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
    </div>
  );
};

export default CompanySection;
