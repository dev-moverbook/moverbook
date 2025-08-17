// CustomerStep.tsx
"use client";

import { useState } from "react";
import Header2 from "@/app/components/shared/heading/Header2";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import FormActions from "@/app/components/shared/FormActions";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useCreateMoveCustomer } from "../../hooks/createCustomer";
import { useUpdateMoveCustomer } from "@/app/hooks/mutations/customers/useUpdateMoveCustomer";
import { validateCustomerForm } from "@/app/frontendUtils/validation";
import { FrontEndErrorMessages } from "@/types/errors";
import CustomerForm from "@/app/components/move/sections/Customer/CustomerForm";
import ExistingCustomerNotice from "../banner/ExistingCustomerNotice";
import { Doc } from "@/convex/_generated/dataModel";
import { isValidEmail, isValidPhoneNumber } from "@/utils/helper";

interface CustomerStepProps {
  onNext: () => void;
  onCancel: () => void;
}

const CustomerStep = ({ onNext, onCancel }: CustomerStepProps) => {
  const { companyId } = useSlugContext();

  const [existingCustomer, setExistingCustomer] =
    useState<Doc<"moveCustomers"> | null>(null);

  const {
    customer,
    setCustomer,
    customerErrors,
    setCustomerErrors,
    referralOptions,
    isLoading,
    isInfoSectionComplete,
    errorMessage,
    moveFormData,
    setMoveFormData,
  } = useMoveForm();

  const {
    createMoveCustomer,
    createMoveCustomerLoading,
    createMoveCustomerError,
    setCreateMoveCustomerError,
  } = useCreateMoveCustomer();

  const {
    updateMoveCustomer,
    updateMoveCustomerLoading,
    updateMoveCustomerError,
    setUpdateMoveCustomerError,
  } = useUpdateMoveCustomer();

  const referralSelectOptions =
    referralOptions?.map((r) => ({ label: r.name, value: r.name })) ?? [];

  const handleChange = (key: keyof typeof customer, value: string): void => {
    // Editing email/phone clears the match → original actions will show again
    if (existingCustomer && (key === "email" || key === "phoneNumber")) {
      setExistingCustomer(null);
    }
    setCustomer({ ...customer, [key]: value });
    if (customerErrors[key]) {
      const { [key]: _removed, ...rest } = customerErrors;
      setCustomerErrors(rest);
    }
  };

  const baseDisabled =
    !customer.name ||
    !isValidEmail(customer.email) ||
    !isValidPhoneNumber(customer.phoneNumber) ||
    !isValidPhoneNumber(customer.altPhoneNumber) || // if optional, relax this
    !customer.referral;

  const isDisabled =
    baseDisabled || createMoveCustomerLoading || updateMoveCustomerLoading;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // If a match exists, user must Select or change inputs
    if (existingCustomer) return;

    const referralValues = referralSelectOptions.map((r) => r.value);
    const { isValid, errors } = validateCustomerForm(customer, referralValues);
    if (!isValid) {
      setCustomerErrors(errors);
      return;
    }

    if (!companyId) {
      setCreateMoveCustomerError(FrontEndErrorMessages.COMPANY_ID_NOT_FOUND);
      return;
    }

    if (moveFormData.moveCustomerId) {
      const response = await updateMoveCustomer({
        moveCustomerId: moveFormData.moveCustomerId,
        updates: {
          name: customer.name,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          altPhoneNumber: customer.altPhoneNumber,
          referral: customer.referral,
        },
      });
      if (response.success) onNext();
      else setUpdateMoveCustomerError(FrontEndErrorMessages.GENERIC);
      return;
    }

    const response = await createMoveCustomer({
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      altPhoneNumber: customer.altPhoneNumber,
      referral: customer.referral,
      companyId,
    });

    if (response.success) {
      if (response.moveCustomerId) {
        setMoveFormData({
          ...moveFormData,
          moveCustomerId: response.moveCustomerId,
        });
        onNext();
      } else if (response.existingCustomer) {
        setExistingCustomer(response.existingCustomer); // swaps action row
      }
    } else {
      setCreateMoveCustomerError(FrontEndErrorMessages.GENERIC);
    }
  };

  return (
    <FormContainer>
      <Header2 isCompleted={isInfoSectionComplete}>
        Customer Information
      </Header2>

      <CustomerForm
        customer={customer}
        errors={customerErrors}
        referralOptions={referralSelectOptions}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onChange={handleChange}
      />

      {existingCustomer ? (
        // When a match exists: replace default actions with Select/View
        <div className="pt-6">
          <ExistingCustomerNotice
            customer={existingCustomer}
            onUse={() => {
              setMoveFormData({
                ...moveFormData,
                moveCustomerId: existingCustomer._id,
              });
              onNext();
            }}
          />
        </div>
      ) : (
        // Normal Cancel/Next
        <FormActionContainer className="pt-10">
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            onCancel={onCancel}
            disabled={isDisabled}
            isSaving={createMoveCustomerLoading || updateMoveCustomerLoading}
            saveLabel="Next"
            cancelLabel="Cancel"
            error={
              createMoveCustomerError || updateMoveCustomerError || errorMessage
            }
          />
        </FormActionContainer>
      )}
    </FormContainer>
  );
};

export default CustomerStep;
