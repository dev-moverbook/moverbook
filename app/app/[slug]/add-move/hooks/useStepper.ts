// app/app/[slug]/add-move/hooks/useWizard.ts
"use client";
import { useState, useCallback } from "react";

export function useStepper(initialStep = 1, maxStep = 4) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  const goToNextStep = useCallback(() => {
    setCurrentStep((previousStep) => Math.min(maxStep, previousStep + 1));
  }, [maxStep]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((previousStep) => Math.max(1, previousStep - 1));
  }, []);

  const jumpToStep = useCallback(
    (targetStep: number) => {
      setCurrentStep(() => Math.min(maxStep, Math.max(1, targetStep)));
    },
    [maxStep]
  );

  return {
    step: currentStep,
    setStep: jumpToStep,
    next: goToNextStep,
    back: goToPreviousStep,
  };
}
