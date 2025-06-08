"use client";
import React, { useState } from "react";
import MoveCard from "@/app/components/move/MoveCard";
import PageContainer from "@/app/components/shared/containers/PageContainer";
import Stepper from "@/app/components/shared/Stepper";

const page = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  return (
    <PageContainer>
      <MoveCard
        date="August 8, 2024"
        name="Samantha Stella"
        avatarUrl="/avatars/samantha.jpg"
        status="New Lead"
        price="$700"
        tags={["Apt", "2 Bedroom", "2 Movers", "Web"]}
      />
      <Stepper
        currentStep={currentStep}
        steps={[
          { label: "Quote" },
          { label: "Deposit" },
          { label: "Move" },
          { label: "Payment" },
        ]}
        onStepClick={(step) => setCurrentStep(step)}
      />
    </PageContainer>
  );
};

export default page;
