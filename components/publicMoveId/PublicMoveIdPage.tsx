"use client";

import Stepper from "../shared/stepper/Stepper";
import { useStepper } from "../add-move/hooks/useStepper";

interface PublicMoveIdPageProps {
  initialStep: number;
}

const PublicMoveIdPage = ({ initialStep }: PublicMoveIdPageProps) => {
  const { step, setStep } = useStepper(initialStep, 4);

  return (
    <Stepper
      currentStep={step}
      steps={[
        { label: "Quote" },
        { label: "Documents" },
        { label: "Move" },
        { label: "Payment" },
      ]}
      onStepClick={setStep}
    />
  );
};

export default PublicMoveIdPage;
