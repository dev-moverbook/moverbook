"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/heading/NavigationHeader";
import ConfirmModal from "@/components/shared/modal/ConfirmModal";
import Stepper from "@/components/shared/stepper/Stepper";
import PageContainer from "@/components/shared/containers/PageContainer";
import { useMoveForm } from "@/contexts/MoveFormContext";
import InventoryStep from "./components/steps/InventoryStep";
import CostStep from "./components/steps/CostStep";
import MoveStep from "./components/steps/MoveStep";
import CustomerStep from "./components/steps/CustomerStep";
import { FrontEndErrorMessages } from "@/types/errors";
import { transformToCreateMoveInput } from "@/frontendUtils/transform";
import { useSlugContext } from "@/contexts/SlugContext";
import { useUnsavedChangesGuard } from "./hooks/useUnsavedChangesGuard";
import { useDuplicateFromMove } from "./hooks/useDuplicateFromMove";
import { usePrefillCustomer } from "./hooks/usePrefillCustomer";
import { useStepper } from "./hooks/useStepper";
import { CreateMoveInput, useCreateMove } from "@/hooks/moves";

export default function AddMovePageContent({
  moveCustomerId,
  duplicateFromId,
  fieldsToDuplicate,
}: {
  moveCustomerId: string | null;
  duplicateFromId: string | null;
  fieldsToDuplicate: string[];
}) {
  const router = useRouter();
  const { slug } = useSlugContext();
  const { setCustomer, setMoveFormData, moveFormData, isAllSectionsComplete } =
    useMoveForm();
  const { createMove, createMoveLoading, createMoveError, setCreateMoveError } =
    useCreateMove();

  const { step, setStep, next, back } = useStepper(1, 4);
  const [showModal, setShowModal] = useState<boolean>(false);

  useUnsavedChangesGuard(true);
  useDuplicateFromMove(duplicateFromId, fieldsToDuplicate, setMoveFormData);
  usePrefillCustomer(moveCustomerId, setCustomer, setMoveFormData, () =>
    setStep(2)
  );

  const closeAndGoBack = () => {
    setShowModal(false);
    router.back();
  };

  const handleNext = async () => {
    if (step < 4) {
      return next();
    }

    setCreateMoveError(null);
    let input: CreateMoveInput;
    try {
      input = transformToCreateMoveInput(moveFormData);
    } catch (err) {
      setCreateMoveError(
        err instanceof Error ? err.message : FrontEndErrorMessages.GENERIC
      );
      return;
    }
    const moveId = await createMove(input);
    if (moveId) {
      const base = `/app/${slug}/moves/${moveId}`;
      router.push(isAllSectionsComplete ? `${base}?step=2` : base);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Move"
        onBack={() => (step === 1 ? setShowModal(true) : back())}
        onClose={() => setShowModal(true)}
      />
      <Stepper
        currentStep={step}
        steps={[
          { label: "Customer" },
          { label: "Move" },
          { label: "Inventory" },
          { label: "Costs" },
        ]}
        onStepClick={setStep}
      />

      {step === 1 && (
        <CustomerStep onNext={handleNext} onCancel={() => setShowModal(true)} />
      )}
      {step === 2 && <MoveStep onNext={handleNext} onBack={back} />}
      {step === 3 && <InventoryStep onNext={handleNext} onBack={back} />}
      {step === 4 && (
        <CostStep
          onNext={handleNext}
          onBack={back}
          isSaving={createMoveLoading}
          saveError={createMoveError}
        />
      )}

      <ConfirmModal
        title="Are you sure you want to leave?"
        description="You have unsaved changes. If you leave, your changes will be lost."
        onClose={() => setShowModal(false)}
        isOpen={showModal}
        onConfirm={closeAndGoBack}
        deleteLoading={false}
        deleteError={null}
      />
    </PageContainer>
  );
}
