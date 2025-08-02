"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import MoveCard from "@/app/components/move/MoveCard";
import Stepper from "@/app/components/shared/Stepper";
import TabSelector from "@/app/components/shared/TabSelector";
import LeadStep from "./components/steps/LeadStep";
import MoveStep from "./components/steps/MoveStep";
import QuoteStep from "./components/steps/QuoteStep";
import PaymentStep from "./components/steps/PaymentStep";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { Doc } from "@/convex/_generated/dataModel";
import DuplicateMoveModal from "../../customer/[customerId]/modals/DuplicateMoveModal";
import { hasRequiredMoveFields } from "@/app/frontendUtils/helper";

interface MoveContentProps {}

const MoveContent = ({}: MoveContentProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("INFO");

  const router = useRouter();
  const pathname = usePathname();
  const { moveData } = useMoveContext();

  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState<boolean>(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"move"> | null>(null);

  const {
    move,
    quote,
    company,
    companyContact,
    policy,
    moveCustomer,
    salesRepUser,
  } = moveData;

  const onEditQuote = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "MESSAGES" && !pathname.endsWith("/messages")) {
      router.push(`${pathname}/messages`);
    }
  };

  const handleDuplicateMove = (move: Doc<"move">) => {
    setSelectedMove(move);
    setIsDuplicateMoveModalOpen(true);
  };

  const handleCloseDuplicateMoveModal = () => {
    setIsDuplicateMoveModalOpen(false);
    setSelectedMove(null);
  };

  const isLeadStepComplete = hasRequiredMoveFields(move, moveCustomer);
  const isQuoteStepComplete = quote?.status === "completed";

  return (
    <main>
      <MoveCard
        move={move}
        moveCustomer={moveCustomer}
        showActions={true}
        onDuplicate={handleDuplicateMove}
        salesRep={salesRepUser}
      />
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
        disabledSteps={[
          ...(!isLeadStepComplete ? [2, 3, 4] : []),
          ...(isLeadStepComplete && !isQuoteStepComplete ? [3, 4] : []),
        ]}
      />

      <TabSelector
        tabs={["INFO", "ACTIVITES", "MESSAGES"]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {currentStep === 1 && activeTab === "INFO" && <LeadStep />}
      {currentStep === 2 && activeTab === "INFO" && (
        <QuoteStep
          move={move}
          moveCustomer={moveCustomer}
          quote={quote}
          company={company}
          salesRep={salesRepUser}
          companyContact={companyContact}
          policy={policy}
          onEditQuote={onEditQuote}
        />
      )}
      {currentStep === 3 && activeTab === "INFO" && (
        <MoveStep move={move} quote={quote} />
      )}
      {currentStep === 4 && activeTab === "INFO" && <PaymentStep move={move} />}
      {selectedMove && isDuplicateMoveModalOpen && (
        <DuplicateMoveModal
          isOpen={isDuplicateMoveModalOpen}
          onClose={handleCloseDuplicateMoveModal}
          move={selectedMove}
        />
      )}
    </main>
  );
};

export default MoveContent;
