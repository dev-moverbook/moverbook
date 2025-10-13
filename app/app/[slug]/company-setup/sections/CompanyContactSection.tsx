"use client";

import { useState } from "react";
import { AddressInput, CompanyContactFormData } from "@/types/form-types";
import { Doc, Id } from "@/convex/_generated/dataModel";
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
import PhoneNumberInput from "@/app/components/shared/labeled/PhoneNumberInput";
import LabeledPlacesAutocomplete from "@/app/components/shared/labeled/LabeledPlacesAutoComplete";

interface CompanyContactSectionProps {
  companyContact: Doc<"companyContact">;
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
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<CompanyContactFormData>({
    email: companyContact.email || "",
    phoneNumber: companyContact.phoneNumber || "",
    address: (companyContact.address as AddressInput) || null,
    website: companyContact.website || "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<FieldKey, string>>({
    email: "",
    phoneNumber: "",
    address: "",
    website: "",
  });

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

  const [verificationStatus, setVerificationStatus] = useState<
    "unverified" | "pending" | "verifying" | "verified" | "error"
  >(() => {
    if (companyContact.sendgridVerified) return "verified";
    if (companyContact.sendgridSenderId && !companyContact.sendgridVerified)
      return "pending";
    return "unverified";
  });

  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const mergeAddress = (patch: Partial<AddressInput>) => {
    setFormData((prev) => {
      const prevAddr: AddressInput = (prev.address as AddressInput) ?? {
        formattedAddress: "",
        placeId: null,
        location: { lat: null, lng: null },
      };

      const next: AddressInput = {
        formattedAddress:
          patch.formattedAddress ?? prevAddr.formattedAddress ?? "",
        placeId: patch.placeId ?? prevAddr.placeId ?? null,
        location:
          patch.location !== undefined
            ? {
                lat:
                  (patch.location as AddressInput["location"]).lat ??
                  prevAddr.location?.lat ??
                  null,
                lng:
                  (patch.location as AddressInput["location"]).lng ??
                  prevAddr.location?.lng ??
                  null,
              }
            : (prevAddr.location ?? { lat: null, lng: null }),
      };

      return { ...prev, address: next };
    });

    setFieldErrors((prev) => ({ ...prev, address: "" }));
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      email: companyContact.email || "",
      phoneNumber: companyContact.phoneNumber || "",
      address: (companyContact.address as AddressInput) || null,
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

  // Disable save unless we have the full Google address payload
  const isDisabled =
    !formData.email ||
    !formData.phoneNumber ||
    !formData.website ||
    !formData.address?.formattedAddress ||
    !formData.address?.placeId ||
    formData.address?.location?.lat == null ||
    formData.address?.location?.lng == null;

  const isComplete =
    !!formData.email &&
    !!formData.phoneNumber &&
    !!formData.address?.formattedAddress;

  const handleSave = async () => {
    const errors: Record<FieldKey, string> = {
      email: "",
      phoneNumber: "",
      address: "",
      website: "",
    };

    if (!formData.email) errors.email = "Email is required.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required.";
    if (!formData.website) errors.website = "Website is required.";

    if (
      !formData.address?.formattedAddress ||
      !formData.address?.placeId ||
      formData.address?.location?.lat == null ||
      formData.address?.location?.lng == null
    ) {
      errors.address =
        "Please choose a valid address from the suggestions so we get place ID and coordinates.";
    }

    const hasErrors = Object.values(errors).some((msg) => msg !== "");
    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }

    const success = await updateCompanyContact(companyContact._id, formData);
    if (success) setIsEditing(false);
  };

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
          onCancelEdit={handleCancel}
          className="px-0 pb-4"
          isCompleted={isComplete}
          showCheckmark={isComplete}
          showAlert={!isComplete}
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

          <PhoneNumberInput
            label="Phone Number"
            value={formData.phoneNumber ?? ""}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, phoneNumber: val }))
            }
            error={fieldErrors.phoneNumber}
            placeholder="Enter phone number"
            isEditing={isEditing}
          />

          {isEditing ? (
            <LabeledPlacesAutocomplete
              value={
                (formData.address as AddressInput | undefined)
                  ?.formattedAddress || ""
              }
              onChange={(text) => mergeAddress({ formattedAddress: text })}
              onPlaceSelected={(place) => {
                mergeAddress({
                  formattedAddress: place.formatted_address ?? "",
                  placeId: place.place_id ?? null,
                  location: place.geometry?.location
                    ? {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                      }
                    : { lat: null, lng: null },
                });
              }}
              isEditing={true}
              showLabel={true}
            />
          ) : (
            <FieldRow
              label="Address"
              name="address"
              value={
                (formData.address as AddressInput | null)?.formattedAddress ??
                ""
              }
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

export default CompanyContactSection;
