"use client";

import Stepper from "../shared/stepper/Stepper";
import { useStepper } from "../add-move/hooks/useStepper";
import QuotesStep from "./components/quote/PublicQuotesStep";

interface PublicMoveIdPageProps {
  initialStep: number;
}

const PublicMoveIdPage = ({ initialStep }: PublicMoveIdPageProps) => {
  const { step, setStep } = useStepper(initialStep, 4);

  return (
    <>
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

      {step === 1 && <QuotesStep />}
    </>
  );
};

export default PublicMoveIdPage;
