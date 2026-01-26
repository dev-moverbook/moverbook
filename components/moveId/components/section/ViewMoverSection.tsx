"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import { useUpdateMove } from "@/hooks/moves";
import StartMoveSection from "@/components/move/movers/StartMoveSection";
import ArriveOriginSection from "@/components/move/movers/ArriveOriginSection";
import EndMoveSection from "@/components/move/movers/EndMoveSectiont";
import BreakMoveSection from "@/components/move/movers/BreakMoveSection";
import { Doc } from "@/convex/_generated/dataModel";
import Contract from "../move/Contract";
import Waiver from "../move/Waiver";
import Discounts from "../payment/Discounts";
import AdditionalFees from "../payment/AdditionalFees";
import InvoiceSummary from "../payment/InvoiceSummary";
import { useMoveContext } from "@/contexts/MoveContext";
import { computeFinalMoveCost } from "@/frontendUtils/payout";
import InvoiceNotReady from "../shared/InvoiceNotReady";
import { isSameDayOrLater } from "@/frontendUtils/luxonUtils";
import LocationSharingSectionWrapper from "./LocationSharingWrapper";

interface ViewMoverSectionProps {
  assignment: Doc<"moveAssignments">;
  contract: Doc<"contracts"> | null;
  discounts: Doc<"discounts">[];
  additionalFees: Doc<"additionalFees">[];
  waiver: Doc<"waivers"> | null;
  fees: Doc<"fees">[];
}

const ViewMoverSection: React.FC<ViewMoverSectionProps> = ({
  assignment,
  contract,
  discounts,
  additionalFees,
  waiver,
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
    moveFees: moveFees ?? [],
    jobType: jobType ?? "hourly",
    jobTypeRate: jobTypeRate ?? 0,
    liabilityCoverage: liabilityCoverage ?? null,
    segmentDistances: segmentDistances ?? [],
    travelFeeRate: travelFeeRate ?? null,
    travelFeeMethod: travelFeeMethod ?? null,
    paymentMethod: paymentMethod ?? { kind: "other", label: "Other" },
    creditCardFee: creditCardFee ?? 0,
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

  const showContract = isSameDayOrLater(move.moveDate, timeZone);

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
      {actualStartTime && <LocationSharingSectionWrapper />}
      {moveData.moverLocation && (
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

      {showContract && <Contract contract={contract} />}
      <Waiver waiver={waiver} />
      <Discounts discounts={discounts} moveId={move._id} />
      <AdditionalFees
        additionalFees={additionalFees}
        moveId={move._id}
        fees={fees}
      />
      {showInvoice ? (
        <>
          <InvoiceSummary items={items} total={total} />
        </>
      ) : (
        <InvoiceNotReady />
      )}
    </>
  );
};

export default ViewMoverSection;
