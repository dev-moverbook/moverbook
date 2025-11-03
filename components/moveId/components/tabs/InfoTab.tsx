"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Stepper from "@/components/shared/stepper/Stepper";
import { useMoveContext } from "@/contexts/MoveContext";
import LeadStep from "../steps/LeadStep";
import QuoteStep from "../steps/QuoteStep";
import MoveStep from "../steps/MoveStep";
import PaymentStep from "../steps/PaymentStep";
import SetupStep from "../steps/SetUpStep";
import { hasRequiredMoveFields } from "@/frontendUtils/helper";

type InfoTabProps = {
  hideStepper?: boolean;
};

const MIN_STEP = 1;
const MAX_STEP = 5;

export default function InfoTab({ hideStepper }: InfoTabProps) {
  const searchParams = useSearchParams();

  const { moveData } = useMoveContext();
  const { move, moveCustomer, quote } = moveData;

  const stepFromQuery = useMemo(() => {
    const stepParam = searchParams.get("step");
    const parsedStep = stepParam ? parseInt(stepParam, 10) : NaN;

    if (!Number.isFinite(parsedStep)) {
      return MIN_STEP;
    }

    return Math.min(Math.max(parsedStep, MIN_STEP), MAX_STEP);
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState<number>(stepFromQuery);

  useEffect(() => {
    setCurrentStep(stepFromQuery);
  }, [stepFromQuery]);

  const isQuoteStepComplete = quote?.status === "completed";

  const isLeadStepComplete = hasRequiredMoveFields(move, moveCustomer);
  const isMoveStepComplete =
    move.actualStartTime && move.actualArrivalTime && move.actualEndTime;

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {!hideStepper && (
        <Stepper
          currentStep={currentStep}
          steps={[
            { label: "Lead" },
            { label: "Quote" },
            { label: "Setup" },
            { label: "Move" },
            { label: "Payment" },
          ]}
          onStepClick={handleStepClick}
          className="mt-4"
          disabledSteps={[
            ...(!isLeadStepComplete ? [2, 3, 4, 5] : []),
            ...(isLeadStepComplete && !isQuoteStepComplete ? [3, 4, 5] : []),
            ...(isLeadStepComplete &&
            !isQuoteStepComplete &&
            !isMoveStepComplete
              ? [5]
              : []),
          ]}
        />
      )}

      {currentStep === 1 && <LeadStep />}
      {currentStep === 2 && <QuoteStep quote={quote} />}
      {currentStep === 3 && <SetupStep />}
      {currentStep === 4 && <MoveStep />}
      {currentStep === 5 && <PaymentStep />}
    </>
  );
}
