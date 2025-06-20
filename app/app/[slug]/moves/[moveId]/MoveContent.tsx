import React, { useState } from "react";
import MoveCard from "@/app/components/move/MoveCard";
import Stepper from "@/app/components/shared/Stepper";
import TabSelector from "@/app/components/shared/TabSelector";
import LeadStep from "./components/steps/LeadStep";
import MoveStep from "./components/steps/MoveStep";
import QuoteStep from "./components/steps/QuoteStep";
import PaymentStep from "./components/steps/PaymentStep";
import {
  formatAccessType,
  formatCurrency,
  formatMoveSize,
  formatMoveType,
} from "@/app/frontendUtils/helper";
import { GetMoveData } from "@/types/convex-responses";

interface MoveContentProps {
  moveData: GetMoveData;
}

const MoveContent = ({ moveData }: MoveContentProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("INFO");

  const { move, quote, company, salesRep, companyContact, policy } = moveData;

  const onEditQuote = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <MoveCard move={move} />
      <Stepper
        currentStep={currentStep}
        steps={[
          { label: "Lead" },
          { label: "Quote" },
          { label: "Move" },
          { label: "Payment" },
        ]}
        onStepClick={(step) => setCurrentStep(step)}
        className="mt-4"
      />
      <TabSelector
        tabs={["INFO", "ACTIVITES", "MESSAGES"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {currentStep === 1 && activeTab === "INFO" && <LeadStep move={move} />}
      {currentStep === 2 && activeTab === "INFO" && (
        <QuoteStep
          quote={quote}
          move={move}
          company={company}
          salesRep={salesRep}
          companyContact={companyContact}
          policy={policy}
          onEditQuote={onEditQuote}
        />
      )}
      {currentStep === 3 && activeTab === "INFO" && (
        <MoveStep move={move} quote={quote} />
      )}
      {currentStep === 4 && activeTab === "INFO" && <PaymentStep move={move} />}
    </main>
  );
};

export default MoveContent;
