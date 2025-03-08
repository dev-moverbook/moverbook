"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyContactSchema } from "@/types/convex-schemas";
import { CompanyContactFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";

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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const success = await updateCompanyContact(companyContact._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Company Contact Information</h2>

      {updateError && <p className="text-red-500">{updateError}</p>}

      {!isEditing ? (
        <div className="space-y-2">
          <p>
            <span className="font-medium">Email:</span>{" "}
            {companyContact.email || "N/A"}
          </p>
          <p>
            <span className="font-medium">Phone Number:</span>{" "}
            {companyContact.phoneNumber || "N/A"}
          </p>
          <p>
            <span className="font-medium">Address:</span>{" "}
            {companyContact.address || "N/A"}
          </p>
          <p>
            <span className="font-medium">Website:</span>{" "}
            {companyContact.website || "N/A"}
          </p>

          <Button onClick={handleEditClick}>Edit</Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <Label className="block text-sm font-medium">Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">Address</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium">Website</Label>
            <Input
              type="text"
              name="website"
              value={formData.website}
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

export default CompanyContactSection;
