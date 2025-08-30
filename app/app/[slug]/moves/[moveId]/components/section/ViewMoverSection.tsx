"use client";

import { GetMovePageForMoverSuccessData } from "@/app/hooks/queries/movers/useMovePageForMover";
import { useUpdateMoveAssignmentHours } from "../../../hooks/useUpdateMoveAssignmentHours";
import MoverSection from "@/app/components/move/movers/MoverSection";
import { useSlugContext } from "@/app/contexts/SlugContext";
import React from "react";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import StartMoveSection from "@/app/components/move/movers/StartMoveSection";
import { useMoveContext } from "@/app/contexts/MoveContext";
import ArriveOriginSection from "@/app/components/move/movers/ArriveOriginSection";
import EndMoveSection from "@/app/components/move/movers/EndMoveSectiont";
// import BreakMoveSection from "@/app/components/move/movers/BreakMoveSection";
import { Doc } from "@/convex/_generated/dataModel";
import PreMove from "../move/PreMove";
import AdditionalLiabilityCoverage from "../move/AdditionalLiabilityCoverage";
import Discounts from "../payment/Discounts";
import AdditionalFees from "../payment/AdditionalFees";
import InvoiceSignature from "../payment/InvoiceSignature";
import InvoiceSummary from "../payment/InvoiceSummary";

interface ViewMoverSectionProps {
  data: GetMovePageForMoverSuccessData;
}

const ViewMoverSection: React.FC<ViewMoverSectionProps> = ({ data }) => {
  const { assignment, isLead } = data;

  let preMoveDoc: Doc<"preMoveDocs"> | null = null;
  let discounts: Doc<"discounts">[] = [];
  let additionalFees: Doc<"additionalFees">[] = [];
  let invoice: Doc<"invoices"> | null = null;
  let additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null =
    null;
  let fees: Doc<"fees">[] = [];

  if (isLead) {
    preMoveDoc = data.preMoveDoc;
    discounts = data.discounts;
    additionalFees = data.additionalFees;
    invoice = data.invoice;
    additionalLiabilityCoverage = data.additionalLiabilityCoverage;
    fees = data.fees;
  }

  const { timeZone } = useSlugContext();
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { actualStartTime, actualArrivalTime, actualEndTime } = move;
  const {
    updateMoveAssignmentHours,
    assignmentUpdateLoading,
    assignmentUpdateError,
  } = useUpdateMoveAssignmentHours();

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const handleStartTimeChange = async (startTime: number) => {
    await updateMoveAssignmentHours({
      assignmentId: assignment._id,
      updates: { startTime },
    });
  };

  const handleEndTimeChange = async (endTime: number) => {
    await updateMoveAssignmentHours({
      assignmentId: assignment._id,
      updates: { endTime },
    });
  };

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

  //   const handleSaveBreakTime = async () => {
  //     await updateMove({
  //       moveId: assignment.moveId,
  //       updates: { actualBreakTime: Date.now() },
  //     });
  //   };

  return (
    <>
      <MoverSection
        isSaving={assignmentUpdateLoading}
        updateError={assignmentUpdateError}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
        assignment={assignment}
        timeZone={timeZone}
        handleChangeBreakTime={handleChangeBreakTime}
      />
      {isLead && (
        <>
          <StartMoveSection
            isSaving={updateMoveLoading}
            updateError={updateMoveError}
            handleStartMove={handleStartMove}
            timeZone={timeZone}
            startTime={actualStartTime}
          />
          <ArriveOriginSection
            isSaving={updateMoveLoading}
            updateError={updateMoveError}
            handleArriveOrigin={handleArriveOrigin}
            timeZone={timeZone}
            arriveOriginTime={actualArrivalTime}
          />
          <EndMoveSection
            isSaving={updateMoveLoading}
            updateError={updateMoveError}
            handleEndMove={handleEndMove}
            timeZone={timeZone}
            endMoveTime={actualEndTime}
          />
          {/* <BreakMoveSection
            isSaving={updateMoveLoading}
            updateError={updateMoveError}
            handleChangeBreakTime={handleChangeBreakTime}
            breakMoveTime={actualBreakTime}
            onSave={handleSaveBreakTime}
          /> */}
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
          <InvoiceSummary
            move={move}
            discounts={discounts}
            additionalFees={additionalFees}
          />
          <InvoiceSignature move={move} invoice={invoice} />
        </>
      )}
    </>
  );
};

export default ViewMoverSection;
