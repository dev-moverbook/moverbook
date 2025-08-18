"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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

const MoveContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // read step from query (?step=1..4), default 1, clamp to [1,4]
  const stepFromQuery = useMemo(() => {
    const raw = searchParams.get("step");
    const n = raw ? parseInt(raw, 10) : NaN;
    if (!Number.isFinite(n)) return 1;
    return Math.min(Math.max(n, 1), 4);
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState<number>(stepFromQuery);
  const [activeTab, setActiveTab] = useState<string>("INFO");

  // keep state in sync if the URL changes externally
  useEffect(() => {
    setCurrentStep(stepFromQuery);
  }, [stepFromQuery]);

  const { moveData } = useMoveContext();
  const [isDuplicateMoveModalOpen, setIsDuplicateMoveModalOpen] =
    useState(false);
  const [selectedMove, setSelectedMove] = useState<Doc<"move"> | null>(null);

  const { move, quote, moveCustomer, salesRepUser } = moveData;

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

  // when user clicks a step, update both state and the URL query
  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    const params = new URLSearchParams(searchParams);
    params.set("step", String(step));
    router.replace(`${pathname}?${params.toString()}`);
  };

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
        onStepClick={handleStepClick}
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
        <QuoteStep quote={quote} onEditQuote={onEditQuote} />
      )}
      {currentStep === 3 && activeTab === "INFO" && <MoveStep />}
      {currentStep === 4 && activeTab === "INFO" && <PaymentStep />}

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
