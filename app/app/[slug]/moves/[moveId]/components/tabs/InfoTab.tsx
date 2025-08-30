"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Stepper from "@/app/components/shared/Stepper";
import { useMoveContext } from "@/app/contexts/MoveContext";
import LeadStep from "../steps/LeadStep";
import QuoteStep from "../steps/QuoteStep";
import MoveStep from "../steps/MoveStep";
import PaymentStep from "../steps/PaymentStep";

type InfoTabProps = {
  hideStepper?: boolean;
};

const MIN_STEP = 1;
const MAX_STEP = 4;

export default function InfoTab({ hideStepper }: InfoTabProps) {
  const router = useRouter();
  const pathname = usePathname();
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

  const isLeadStepComplete = React.useMemo(() => {
    // local duplicate of your helper to avoid extra import in this snippet:
    // but if you already export `hasRequiredMoveFields`, import and use it instead.
    return !!(move && moveCustomer); // replace with hasRequiredMoveFields(move, moveCustomer)
  }, [move, moveCustomer]);

  const isQuoteStepComplete = quote?.status === "completed";

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    const params = new URLSearchParams(searchParams);
    params.set("step", String(step));
    router.replace(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onEditQuote = () => {
    handleStepClick(1);
  };

  return (
    <>
      {!hideStepper && (
        <Stepper
          currentStep={currentStep}
          steps={[
            { label: "Lead" },
            { label: "Quote" },
            { label: "Move" },
            { label: "Payment" },
          ]}
          onStepClick={handleStepClick}
          className="mt-4"
          disabledSteps={[
            ...(!isLeadStepComplete ? [2, 3, 4] : []),
            ...(isLeadStepComplete && !isQuoteStepComplete ? [3, 4] : []),
          ]}
        />
      )}

      {currentStep === 1 && <LeadStep />}
      {currentStep === 2 && (
        <QuoteStep quote={quote} onEditQuote={onEditQuote} />
      )}
      {currentStep === 3 && <MoveStep />}
      {currentStep === 4 && <PaymentStep />}
    </>
  );
}
