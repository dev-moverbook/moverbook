import React from "react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // starts at 1
  onStepClick?: (stepNumber: number) => void;
  className?: string; // ← new optional className prop
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className, // ← include here
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 md:gap-6 relative",
        className // ← append user-defined className
      )}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        const handleClick = () => {
          if (onStepClick) onStepClick(stepNumber);
        };

        return (
          <div
            key={step.label}
            className="flex flex-col items-center relative min-w-[72px] cursor-pointer group"
            onClick={handleClick}
          >
            {/* Step circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 z-10 transition-colors",
                isCompleted &&
                  "bg-greenCustom text-white border-greenCustom group-hover:brightness-110",
                isCurrent &&
                  "border-greenCustom text-greenCustom group-hover:brightness-110",
                !isCompleted &&
                  !isCurrent &&
                  "border-gray-500 text-white group-hover:border-white"
              )}
            >
              {stepNumber}
            </div>

            {/* Step label */}
            <div className="mt-1 text-xs text-white text-center leading-tight min-h-[32px] group-hover:text-white/90">
              {step.label.split(" ").map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute top-4 right-[-30px] md:right-[-44px] w-12 md:w-16 h-px bg-gray-600 z-0" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
