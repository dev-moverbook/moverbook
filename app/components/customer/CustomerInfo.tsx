"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Pencil,
  PhoneForwarded,
  X,
  UserIcon,
  CircleCheckBig,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import IconButton from "../shared/IconButton";
import EditableIconField from "../shared/labeled/EditableIconField";
import { CustomerFormData, CustomerFormErrors } from "@/types/form-types";
import { validateCustomerForm } from "@/app/frontendUtils/validation";
import { useReferralSources } from "@/app/hooks/queries/useReferralSources";
import FormActions from "../shared/FormActions";
import LabeledInput from "../shared/labeled/LabeledInput";
import { useUpdateMoveCustomer } from "@/app/hooks/mutations/customers/useUpdateMoveCustomer";
import EditableIconSelectField from "../shared/labeled/EditableIconSelectField";
import { cn } from "@/lib/utils";

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
  const { name, phoneNumber, altPhoneNumber, email, referral } = moveCustomer;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { options: referralOptions } = useReferralSources(
    moveCustomer.companyId
  );
  const referralSelectOptions =
    referralOptions?.map((r) => ({ label: r.label, value: r.value })) ?? [];

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

  const isDisabled = formData.name.trim() === "";
  const isCompleted =
    !!formData.name?.trim() &&
    !!formData.email?.trim() &&
    !!formData.phoneNumber?.trim() &&
    !!formData.referral?.trim();

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative max-w-screen-sm mx-auto flex items-start bg-black p-4 md:px-0 text-white shadow-md border-b sm:border-none border-grayCustom",
        onClick &&
          "cursor-pointer hover:bg-background2 transition-colors duration-200"
      )}
    >
      {/* Edit / Cancel icon top-right */}
      <div className="absolute top-5 right-2">
        <IconButton
          icon={isEditing ? <X /> : <Pencil />}
          onClick={() => setIsEditing(!isEditing)}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-2 w-full">
        {/* Name field */}
        {isEditing ? (
          <LabeledInput
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            isEditing
            label="Name"
            valueClassName="text-2xl font-semibold text-white"
          />
        ) : (
          <div className="flex items-center gap-1.5">
            <LabeledInput
              value={formData.name}
              onChange={() => {}}
              isEditing={false}
              valueClassName="text-2xl font-bold text-white"
            />
            {showCheckmark && (
              <CircleCheckBig
                className={cn(
                  "w-5 h-5 mt-2",
                  isCompleted ? "text-greenCustom" : "text-grayCustom2"
                )}
              />
            )}
          </div>
        )}

        {/* Contact fields */}
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
