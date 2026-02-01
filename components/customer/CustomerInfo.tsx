"use client";

import { useState } from "react";
import { Mail, Phone, PhoneForwarded, Contact } from "lucide-react";
import EditableIconField from "../shared/labeled/EditableIconField";
import { CustomerFormData, CustomerFormErrors } from "@/types/form-types";
import { validateCustomerForm } from "@/frontendUtils/validation";
import FormActions from "@/components/shared/buttons/FormActions";
import { useUpdateMoveCustomer } from "@/hooks/moveCustomers/useUpdateMoveCustomer";
import { cn } from "@/lib/utils";
import SectionHeader from "../shared/section/SectionHeader";
import { isValidEmail, isValidPhoneNumber } from "@/utils/helper";
import { useSlugContext } from "@/contexts/SlugContext";
import { canCreateMove, isMover } from "@/frontendUtils/permissions";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface CustomerInfoProps {
  moveCustomer: Doc<"moveCustomers">;
  onClick?: () => void;
  showCheckmark?: boolean;
  isMoverLead?: boolean;
  moveId?: Id<"moves">;
  isUneditable?: boolean;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  moveCustomer,
  onClick,
  showCheckmark,
  isMoverLead,
  moveId,
  isUneditable,
}) => {
  const { user, companyId } = useSlugContext();
  const canCreateMoveUser = canCreateMove(user?.role);
  const isMoverUser = isMover(user?.role);
  const { name, phoneNumber, altPhoneNumber, email } = moveCustomer;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    updateMoveCustomer,
    isLoading: updateMoveCustomerLoading,
    error: updateMoveCustomerError,
    setError: setUpdateMoveCustomerError,
  } = useUpdateMoveCustomer();

  const [formData, setFormData] = useState<CustomerFormData>({
    name,
    email,
    phoneNumber: phoneNumber ?? "",
    altPhoneNumber: altPhoneNumber ?? "",
  });

  const [errors, setErrors] = useState<CustomerFormErrors>({});

  const handleSave = async () => {
    setUpdateMoveCustomerError(null);
    const { isValid, errors } = validateCustomerForm(formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    await updateMoveCustomer({
      moveCustomerId: moveCustomer._id,
      companyId: companyId,
      updates: formData,
      moveId: moveId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name,
      email,
      phoneNumber: phoneNumber ?? "",
      altPhoneNumber: altPhoneNumber ?? "",
    });
    setIsEditing(false);
    setErrors({});
  };

  const isCompleted =
    !!formData.name?.trim() &&
    isValidEmail(formData.email) &&
    isValidPhoneNumber(formData.phoneNumber) &&
    isValidPhoneNumber(formData.altPhoneNumber);

  const hasNoChanges =
    formData.name === name &&
    formData.email === email &&
    formData.phoneNumber === (phoneNumber ?? "") &&
    formData.altPhoneNumber === (altPhoneNumber ?? "");

  const isDisabled = !isCompleted || (isEditing && hasNoChanges);

  const showContactFields = !isMoverUser || isMoverLead;
  const submitError =
    updateMoveCustomerError ||
    errors.name ||
    errors.email ||
    errors.phoneNumber ||
    errors.altPhoneNumber;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative max-w-screen-sm mx-auto flex items-start bg-black p-4 md:px-0 text-white shadow-md border-b sm:border-none border-grayCustom",
        onClick &&
          "cursor-pointer hover:bg-background2 transition-colors duration-200"
      )}
    >
      <div className="flex flex-col gap-2 w-full">
        <SectionHeader
          title="Customer Info"
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
          onCancelEdit={handleCancel}
          className="px-0 pt-0"
          showCheckmark={showCheckmark && canCreateMoveUser}
          isCompleted={isCompleted}
          canEdit={canCreateMoveUser}
          isUneditable={isUneditable}
        />
        <EditableIconField
          icon={<Contact className="w-4 h-4" />}
          value={formData.name}
          onChange={(val) => setFormData({ ...formData, name: val })}
          isEditing={isEditing}
          label="Name"
          placeholder="Enter name"
        />
        {showContactFields && (
          <>
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
              onChange={(val) =>
                setFormData({ ...formData, altPhoneNumber: val })
              }
              isEditing={isEditing}
              label="Alternative Phone Number"
              placeholder="Enter alternative phone number"
              isPhoneNumber
              suffix=" (Alternative)"
            />
          </>
        )}
        {isEditing && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={handleCancel}
            isSaving={updateMoveCustomerLoading}
            error={submitError}
            disabled={isDisabled}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;
