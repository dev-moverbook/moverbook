"use client";

import { useState } from "react";
import Header2 from "@/components/shared/heading/Header2";
import FormContainer from "@/components/shared/containers/FormContainer";
import FormActions from "@/components/shared/buttons/FormActions";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import { useMoveForm } from "@/contexts/MoveFormContext";
import { useSlugContext } from "@/contexts/SlugContext";
import { useUpdateMoveCustomer } from "@/hooks/moveCustomers";
import { validateCustomerForm } from "@/frontendUtils/validation";
import { FrontEndErrorMessages } from "@/types/errors";
import CustomerForm from "@/components/move/sections/Customer/CustomerForm";
import ExistingCustomerNotice from "../banner/ExistingCustomerNotice";
import { Doc } from "@/convex/_generated/dataModel";
import { isValidEmail, isValidPhoneNumber } from "@/utils/helper";
import { useCreateMoveCustomer } from "@/hooks/moveCustomers";

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
    isInfoSectionComplete,
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

  const handleChange = (key: keyof typeof customer, value: string): void => {
    if (existingCustomer && (key === "email" || key === "phoneNumber")) {
      setExistingCustomer(null);
    }
    setCustomer({ ...customer, [key]: value });
    if (customerErrors[key]) {
      setCustomerErrors({ ...customerErrors, [key]: undefined });
    }
  };

  const baseDisabled =
    !customer.name ||
    !isValidEmail(customer.email) ||
    !isValidPhoneNumber(customer.phoneNumber) ||
    !isValidPhoneNumber(customer.altPhoneNumber);

  const isDisabled =
    baseDisabled || createMoveCustomerLoading || updateMoveCustomerLoading;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (existingCustomer) {
      return;
    }

    const { isValid, errors } = validateCustomerForm(customer);
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
        },
      });
      if (response) {
        onNext();
      } else setUpdateMoveCustomerError(FrontEndErrorMessages.GENERIC);
      return;
    }

    const response = await createMoveCustomer({
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      altPhoneNumber: customer.altPhoneNumber,
      companyId,
    });

    if (!response) {
      setCreateMoveCustomerError(createMoveCustomerError);
      return;
    }

    if (response.isExistingCustomer) {
      setExistingCustomer(response.moveCustomer);
      return;
    }
    setMoveFormData({
      ...moveFormData,
      moveCustomerId: response.moveCustomer._id,
    });
    onNext();
  };

  return (
    <FormContainer>
      <Header2 isCompleted={isInfoSectionComplete}>
        Customer Information
      </Header2>

      <CustomerForm
        customer={customer}
        errors={customerErrors}
        onChange={handleChange}
      />

      {existingCustomer ? (
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
            error={createMoveCustomerError || updateMoveCustomerError}
          />
        </FormActionContainer>
      )}
    </FormContainer>
  );
};

export default CustomerStep;
