"use client";

import FormActions from "@/components/shared/buttons/FormActions";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { isValidEmail } from "@/frontendUtils/helper";
import { useUpdateMoveCustomerByCustomer } from "@/hooks/moveCustomers/useUpdateMoveCustomerByCustomer";
import { CustomerFormData } from "@/types/form-types";
import { isValidPhoneNumber } from "@/utils/helper";
import { useMemo } from "react";

interface MoveCustomerUpdateActionsProps {
  onCancel: () => void;
  moveCustomerformData: CustomerFormData;
}

const MoveCustomerUpdateActions = ({
  onCancel,
  moveCustomerformData,
}: MoveCustomerUpdateActionsProps) => {
  const { move } = usePublicMoveIdContext();
  const { company, moveCustomer, move: moveData } = move;
  const { updateMoveCustomerByCustomer, isLoading, error } =
    useUpdateMoveCustomerByCustomer();

  const isDisabled = useMemo(() => {
    const { name, email, phoneNumber } = moveCustomerformData;

    const hasEmptyFields = !name.trim() || !email.trim() || !phoneNumber.trim();

    const isInvalid = !isValidEmail(email) || !isValidPhoneNumber(phoneNumber);

    const isSameAsOriginal =
      name === moveCustomer.name &&
      email === moveCustomer.email &&
      phoneNumber === moveCustomer.phoneNumber &&
      (moveCustomerformData.altPhoneNumber || "") ===
        (moveCustomer.altPhoneNumber || "");

    return hasEmptyFields || isInvalid || isSameAsOriginal || isLoading;
  }, [moveCustomerformData, moveCustomer, isLoading]);

  const handleSave = async () => {
    const success = await updateMoveCustomerByCustomer({
      moveCustomerId: moveCustomer._id,
      companyId: company._id,
      moveId: moveData._id,
      updates: moveCustomerformData,
    });
    if (success) {
      onCancel();
    }
  };

  return (
    <FormActions
      onSave={(e) => {
        e.preventDefault();
        handleSave();
      }}
      onCancel={onCancel}
      isSaving={isLoading}
      error={error}
      disabled={isDisabled}
    />
  );
};

export default MoveCustomerUpdateActions;
