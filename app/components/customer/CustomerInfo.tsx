"use client";

import React, { useState } from "react";
import { Mail, Phone, PhoneForwarded, UserIcon, Contact } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import EditableIconField from "../shared/labeled/EditableIconField";
import { CustomerFormData, CustomerFormErrors } from "@/types/form-types";
import { validateCustomerForm } from "@/app/frontendUtils/validation";
import { useReferralSources } from "@/app/hooks/queries/useReferralSources";
import FormActions from "../shared/FormActions";
import { useUpdateMoveCustomer } from "@/app/hooks/mutations/customers/useUpdateMoveCustomer";
import EditableIconSelectField from "../shared/labeled/EditableIconSelectField";
import { cn } from "@/lib/utils";
import SectionHeader from "../shared/SectionHeader";
import { isValidEmail, isValidPhoneNumber } from "@/utils/helper";
import { ClerkRoles, QueryStatus } from "@/types/enums";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { canCreateMove, isMover } from "@/app/frontendUtils/permissions";

interface CustomerInfoProps {
  moveCustomer: Doc<"moveCustomers">;
  onClick?: () => void;
  showCheckmark?: boolean;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  moveCustomer,
  onClick,
  showCheckmark,
}) => {
  const { user } = useSlugContext();
  const canCreateMoveUser = canCreateMove(
    user.publicMetadata.role as ClerkRoles
  );
  const isMoverUser = isMover(user.publicMetadata.role as ClerkRoles);
  const { name, phoneNumber, altPhoneNumber, email, referral } = moveCustomer;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const result = useReferralSources(moveCustomer.companyId, {
    enabled: !isMoverUser,
  });
  const referralSelectOptions =
    result.status === QueryStatus.SUCCESS
      ? result.options.map((r) => ({ label: r.label, value: r.value }))
      : [];

  const {
    updateMoveCustomer,
    updateMoveCustomerLoading,
    updateMoveCustomerError,
    setUpdateMoveCustomerError,
  } = useUpdateMoveCustomer();

  const [formData, setFormData] = useState<CustomerFormData>({
    name,
    email,
    phoneNumber,
    altPhoneNumber,
    referral,
  });

  const [errors, setErrors] = useState<CustomerFormErrors>({});

  const handleSave = async () => {
    setUpdateMoveCustomerError(null);
    const referralValues = referralSelectOptions.map((r) => r.value);
    const { isValid, errors } = validateCustomerForm(formData, referralValues);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    await updateMoveCustomer({
      moveCustomerId: moveCustomer._id,
      updates: formData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name,
      email,
      phoneNumber,
      altPhoneNumber,
      referral,
    });
    setIsEditing(false);
  };

  const isCompleted =
    !!formData.name?.trim() &&
    isValidEmail(formData.email) &&
    isValidPhoneNumber(formData.phoneNumber) &&
    isValidPhoneNumber(formData.altPhoneNumber) &&
    !!formData.referral?.trim();

  const isDisabled = !isCompleted;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative max-w-screen-sm mx-auto flex items-start bg-black p-4 md:px-0 text-white shadow-md border-b sm:border-none border-grayCustom",
        onClick &&
          "cursor-pointer hover:bg-background2 transition-colors duration-200"
      )}
    >
      {/* Main Content */}
      <div className="flex flex-col gap-2 w-full">
        {/* Name field */}
        <SectionHeader
          title="Customer Info"
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
          onCancelEdit={() => setIsEditing(false)}
          className="px-0 pt-0"
          showCheckmark={showCheckmark}
          isCompleted={isCompleted}
          canEdit={canCreateMoveUser}
        />
        {/* Contact fields */}
        <EditableIconField
          icon={<Contact className="w-4 h-4" />}
          value={formData.name}
          onChange={(val) => setFormData({ ...formData, name: val })}
          isEditing={isEditing}
          label="Name"
          placeholder="Enter name"
        />
        <EditableIconField
          icon={<Phone className="w-4 h-4" />}
          value={formData.phoneNumber}
          onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
          isEditing={isEditing}
          label="Phone Number"
          placeholder="Enter phone number"
          isPhoneNumber
        />
        <EditableIconField
          icon={<Mail className="w-4 h-4" />}
          value={formData.email}
          onChange={(val) => setFormData({ ...formData, email: val })}
          isEditing={isEditing}
          label="Email"
          placeholder="Enter email"
        />
        <EditableIconField
          icon={<PhoneForwarded className="w-4 h-4" />}
          value={formData.altPhoneNumber || ""}
          onChange={(val) => setFormData({ ...formData, altPhoneNumber: val })}
          isEditing={isEditing}
          label="Alternative Phone Number"
          placeholder="Enter alternative phone number"
          isPhoneNumber
          suffix="  (alt)"
        />
        <EditableIconSelectField
          icon={<UserIcon className="w-4 h-4" />}
          value={formData.referral}
          options={referralSelectOptions.map((o) => o.value)}
          isEditing={isEditing}
          onChange={(val) => setFormData({ ...formData, referral: val })}
          error={errors.referral}
          label="Referral"
        />
        {/* Actions */}
        {isEditing && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={handleCancel}
            isSaving={updateMoveCustomerLoading}
            error={updateMoveCustomerError}
            disabled={isDisabled}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;
