"use client";

import Stepper from "@/components/shared/stepper/Stepper";
import ContactsStep from "./ContactsStep";
import MoveDetailsStep from "./MoveDetailsStep";
import { useStepper } from "@/components/add-move/hooks/useStepper";

interface PublicNewMoveStepsProps {
  stepper: ReturnType<typeof useStepper>;
}

const PublicNewMoveSteps = ({ stepper }: PublicNewMoveStepsProps) => {
  const { step, setStep } = stepper;

  return (
    <>
      <Stepper
        currentStep={step}
        steps={[{ label: "Move" }, { label: "Contact" }]}
        onStepClick={setStep}
      />
      {step === 1 && <MoveDetailsStep />}
      {step === 2 && <ContactsStep />}
    </>
  );
};

export default PublicNewMoveSteps;
