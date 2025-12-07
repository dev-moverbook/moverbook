"use client";

import { useStepper } from "@/components/add-move/hooks/useStepper";
import FormActions from "@/components/shared/buttons/FormActions";
import { usePublicNewMoveForm } from "@/contexts/PublicNewMoveFormContext";
import { useSlugContext } from "@/contexts/SlugContext";
import { useCreatePublicMove } from "@/hooks/moveCustomers/useCreatePublicMove";

interface NewMoveFormActionsProps {
  stepper: ReturnType<typeof useStepper>;
}

const NewMoveFormActions = ({ stepper }: NewMoveFormActionsProps) => {
  const { companyId } = useSlugContext();
  const { publicNewMoveFormData, setIsMoveSubmitted, isSubmitDisabled } =
    usePublicNewMoveForm();
  const { createPublicMove, createPublicMoveLoading, createPublicMoveError } =
    useCreatePublicMove();

  const { step, next, back } = stepper;

  const handleNext = async () => {
    if (step === 1) {
      next();
    } else {
      const success = await createPublicMove({
        companyId,
        name: publicNewMoveFormData.name,
        email: publicNewMoveFormData.email,
        phoneNumber: publicNewMoveFormData.phoneNumber,
        altPhoneNumber: publicNewMoveFormData.altPhoneNumber,
        serviceType: publicNewMoveFormData.serviceType,
      });

      if (success) {
        setIsMoveSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) back();
  };

  const submitText = step === 1 ? "Next" : "Submit";

  const isDisabled = step === 2 ? isSubmitDisabled : false;

  return (
    <FormActions
      onSave={(e) => {
        e.preventDefault();
        handleNext();
      }}
      onCancel={handleBack}
      isSaving={createPublicMoveLoading}
      saveLabel={submitText}
      cancelLabel="Back"
      error={createPublicMoveError}
      disabled={isDisabled}
    />
  );
};

export default NewMoveFormActions;
