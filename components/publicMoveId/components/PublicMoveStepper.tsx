"use client";

import Stepper from "@/components/shared/stepper/Stepper";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";

interface PublicMoveStepperProps {
  step: number;
  setStep: (step: number) => void;
}

const PublicMoveStepper = ({ step, setStep }: PublicMoveStepperProps) => {
  const { move } = usePublicMoveIdContext();
  const quoteStatus = move.quote?.status;

  const isQuoteComplete = quoteStatus === "completed";
  const isContractComplete: boolean =
    move.contract !== null && move.contract.customerSignature !== undefined;
  const isMoveComplete = !!move.move.actualEndTime;

  let disabledSteps: number[] = [];

  if (!isQuoteComplete) {
    disabledSteps = [2, 3, 4];
  } else if (!isContractComplete) {
    disabledSteps = [3, 4];
  } else if (!isMoveComplete) {
    disabledSteps = [4];
  }

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
      disabledSteps={disabledSteps}
    />
  );
};

export default PublicMoveStepper;
