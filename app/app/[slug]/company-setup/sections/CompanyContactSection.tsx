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
import { Button } from "@/app/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useCreateSender } from "../hooks/useCreateSender";
import { useCheckSenderVerified } from "../hooks/useCheckSenderVerified";
import { PlacesAutoCompleteInput } from "@/app/components/shared/PlacesAutoCompleteInput";

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

  // Email verification hooks
  const {
    createSender,
    isLoading: isCreatingSender,
    error: createSenderError,
  } = useCreateSender();
  const {
    checkSenderVerified,
    isLoading: isCheckingVerification,
    error: checkVerificationError,
  } = useCheckSenderVerified();

  // Determine the verification status based on companyContact data
  const [verificationStatus, setVerificationStatus] = useState<
    "unverified" | "pending" | "verifying" | "verified" | "error"
  >(() => {
    if (companyContact.sendgridVerified) return "verified";
    if (companyContact.sendgridSenderId && !companyContact.sendgridVerified)
      return "pending";
    return "unverified";
  });

  // Track specific error messages for each verification step
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

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

  // Step 1: Create a sender (if it doesn't exist)
  const handleCreateSender = async () => {
    try {
      setVerificationError(null);
      setVerificationStatus("verifying");

      const success = await createSender(companyContact._id);
      if (success) {
        setVerificationStatus("pending");
      } else {
        setVerificationStatus("error");
        setVerificationError(
          createSenderError || "Failed to create sender. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating sender:", error);
      setVerificationStatus("error");
      setVerificationError(
        "An unexpected error occurred while creating the sender."
      );
    }
  };

  // Step 2: Check if the sender is verified
  const handleCheckVerification = async () => {
    try {
      setVerificationError(null);
      setVerificationStatus("verifying");

      const isVerified = await checkSenderVerified(companyContact._id);
      setVerificationStatus(isVerified ? "verified" : "pending");

      if (!isVerified) {
        setVerificationError(
          "Email not yet verified. Please check your email for a verification link from SendGrid."
        );
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      setVerificationStatus("error");
      setVerificationError(
        checkVerificationError ||
          "Failed to check verification status. Please try again."
      );
    }
  };

  // Render the appropriate button based on verification status
  const renderVerificationButton = () => {
    if (verificationStatus === "verified") {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Email verified</span>
        </div>
      );
    }

    if (verificationStatus === "verifying") {
      return (
        <div className="flex items-center text-amber-600">
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          <span className="text-sm">Processing...</span>
        </div>
      );
    }

    if (verificationStatus === "error") {
      return (
        <div className="flex items-center text-red-600">
          <XCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Verification failed</span>
        </div>
      );
    }

    if (verificationStatus === "pending") {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCheckVerification}
          disabled={isCheckingVerification}
        >
          {isCheckingVerification ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Checking...
            </>
          ) : (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              Verification Complete
            </div>
          )}
        </Button>
      );
    }

    // Default: unverified state
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleCreateSender}
        disabled={isCreatingSender}
      >
        {isCreatingSender ? (
          <>
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            Creating...
          </>
        ) : (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            Verify Email
          </div>
        )}
      </Button>
    );
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
          <div className="flex flex-col gap-2">
            <FieldRow
              label="Email"
              name="email"
              value={formData.email}
              isEditing={isEditing}
              onChange={handleChange}
              type="email"
              error={fieldErrors.email}
            />

            {!isEditing && (
              <div className="flex flex-col gap-1 w-[200px]">
                {renderVerificationButton()}
                {verificationError && (
                  <div className="text-sm text-red-600 mt-1">
                    {verificationError}
                  </div>
                )}
              </div>
            )}
          </div>

          <FieldRow
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            isEditing={isEditing}
            onChange={handleChange}
            error={fieldErrors.phoneNumber}
          />

          {isEditing ? (
            <PlacesAutoCompleteInput
              value={formData.address || ""}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, address: val }))
              }
            />
          ) : (
            <FieldRow
              label="Address"
              name="address"
              value={formData.address}
              isEditing={false}
              onChange={handleChange}
              error={fieldErrors.address}
            />
          )}

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
