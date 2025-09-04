"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
import React from "react";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import StartMoveSection from "@/app/components/move/movers/StartMoveSection";
import ArriveOriginSection from "@/app/components/move/movers/ArriveOriginSection";
import EndMoveSection from "@/app/components/move/movers/EndMoveSectiont";
import BreakMoveSection from "@/app/components/move/movers/BreakMoveSection";
import { Doc } from "@/convex/_generated/dataModel";
import PreMove from "../move/PreMove";
import AdditionalLiabilityCoverage from "../move/AdditionalLiabilityCoverage";
import Discounts from "../payment/Discounts";
import AdditionalFees from "../payment/AdditionalFees";
import InvoiceSignature from "../payment/InvoiceSignature";
import InvoiceSummary from "../payment/InvoiceSummary";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { computeFinalMoveCost } from "@/app/frontendUtils/payout";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import InvoiceNotReady from "../shared/InvoiceNotReady";

interface ViewMoverSectionProps {
  assignment: Doc<"moveAssignments">;
  preMoveDoc: Doc<"preMoveDocs"> | null;
  discounts: Doc<"discounts">[];
  additionalFees: Doc<"additionalFees">[];
  invoice: Doc<"invoices"> | null;
  additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null;
  fees: Doc<"fees">[];
}

const ViewMoverSection: React.FC<ViewMoverSectionProps> = ({
  assignment,
  preMoveDoc,
  discounts,
  additionalFees,
  invoice,
  additionalLiabilityCoverage,
  fees,
}) => {
  const { timeZone } = useSlugContext();
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const {
    actualStartTime,
    actualArrivalTime,
    actualEndTime,
    actualBreakTime,
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    segmentDistances,
    travelFeeRate,
    travelFeeMethod,
    paymentMethod,
    creditCardFee,
    deposit,
  } = move;

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const handleStartMove = async () => {
    await updateMove({
      moveId: assignment.moveId,
      updates: { actualStartTime: Date.now() },
    });
  };

  const handleArriveOrigin = async () => {
    await updateMove({
      moveId: assignment.moveId,
      updates: { actualArrivalTime: Date.now() },
    });
  };

  const handleEndMove = async () => {
    await updateMove({
      moveId: assignment.moveId,
      updates: { actualEndTime: Date.now() },
    });
  };

  const handleChangeBreakTime = async (breakTime: number) => {
    await updateMove({
      moveId: assignment.moveId,
      updates: { actualBreakTime: breakTime },
    });
  };

  const handleSetStartTime = async (millis: number) => {
    await updateMove({
      moveId: assignment.moveId,
      updates: { actualStartTime: millis },
    });
  };

  const handleSetArriveOrigin = async (millis: number) => {
    await updateMove({
      moveId: assignment.moveId,
      updates: { actualArrivalTime: millis },
    });
  };

  const handleSetEndMove = async (millis: number) => {
    await updateMove({
      moveId: assignment.moveId,
      updates: { actualEndTime: millis },
    });
  };

  const { items, total } = computeFinalMoveCost({
    moveFees,
    jobType,
    jobTypeRate: jobTypeRate ?? 0,
    liabilityCoverage,
    segmentDistances,
    travelFeeRate: travelFeeRate ?? null,
    travelFeeMethod: travelFeeMethod ?? null,
    paymentMethod,
    creditCardFee,
    actualBreakTime: actualBreakTime ?? 0,
    actualStartTime: actualStartTime ?? 0,
    actualEndTime: actualEndTime ?? 0,
    actualArrivalTime: actualArrivalTime ?? 0,
    additionalFees,
    discounts,
    deposit: deposit ?? 0,
  });

  const showInvoice =
    !!actualStartTime && !!actualArrivalTime && !!actualEndTime;

  return (
    <>
      <StartMoveSection
        isSaving={updateMoveLoading}
        updateError={updateMoveError}
        handleStartMove={handleStartMove}
        timeZone={timeZone}
        startTime={actualStartTime}
        handleSetStartTime={handleSetStartTime}
      />

      {actualStartTime && (
        <ArriveOriginSection
          isSaving={updateMoveLoading}
          updateError={updateMoveError}
          handleArriveOrigin={handleArriveOrigin}
          timeZone={timeZone}
          arriveOriginTime={actualArrivalTime}
          handleSetArriveOrigin={handleSetArriveOrigin}
        />
      )}

      {actualArrivalTime && (
        <EndMoveSection
          isSaving={updateMoveLoading}
          updateError={updateMoveError}
          handleEndMove={handleEndMove}
          timeZone={timeZone}
          endMoveTime={actualEndTime}
          handleSetEndMove={handleSetEndMove}
        />
      )}

      {actualEndTime && (
        <BreakMoveSection
          isSaving={updateMoveLoading}
          updateError={updateMoveError}
          handleChangeBreakTime={handleChangeBreakTime}
          breakMoveTime={actualBreakTime}
        />
      )}

      <PreMove preMoveDoc={preMoveDoc} />
      <AdditionalLiabilityCoverage
        additionalLiabilityCoverage={additionalLiabilityCoverage}
      />
      <Discounts discounts={discounts} moveId={move._id} />
      <AdditionalFees
        additionalFees={additionalFees}
        moveId={move._id}
        fees={fees}
      />
      {showInvoice ? (
        <>
          <InvoiceSummary items={items} total={total} />
          <InvoiceSignature move={move} invoice={invoice} total={total} />
        </>
      ) : (
        <InvoiceNotReady />
      )}
    </>
  );
};

export default ViewMoverSection;
