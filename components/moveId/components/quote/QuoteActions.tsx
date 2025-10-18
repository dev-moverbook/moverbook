"use client";
import React, { FormEvent, useState } from "react";
import TripleFormAction from "@/components/shared/buttons/TripleFormAction";
import { useCreateOrUpdateQuote } from "@/hooks/quote";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import { useUpdateMove } from "@/hooks/moves";
import { useMoveContext } from "@/contexts/MoveContext";

interface QuoteActionsProps {
  onEditQuote: () => void;
  signatureDataUrl: string | null;
}

const QuoteActions = ({ onEditQuote, signatureDataUrl }: QuoteActionsProps) => {
  const [activeLoading, setActiveLoading] = useState<
    "send" | "complete" | null
  >(null);
  const { createOrUpdateQuote, quoteUpdateError } = useCreateOrUpdateQuote();
  const { updateMove, updateMoveError } = useUpdateMove();

  const { moveData } = useMoveContext();
  const { move, quote } = moveData;
  const { _id: moveId, moveStatus } = move;

  const handleUpdateMoveStatusToQuoted = async () => {
    if (moveStatus === "New Lead") {
      await updateMove({
        moveId,
        updates: {
          moveStatus: "Quoted",
        },
      });
    }
  };

  const handleUpdateMoveStatusToBooked = async () => {
    if (moveStatus === "Quoted" || moveStatus === "New Lead") {
      await updateMove({
        moveId,
        updates: { moveStatus: "Booked" },
      });
    }
  };

  const handleSendQuote = async (e: FormEvent) => {
    e.preventDefault();
    setActiveLoading("send");
    await createOrUpdateQuote({
      moveId,
      updates: {
        status: "pending",
        ...(signatureDataUrl && { repSignature: signatureDataUrl }),
      },
    });
    handleUpdateMoveStatusToQuoted();
    setActiveLoading(null);
  };

  const handleEditQuote = () => {
    onEditQuote();
  };

  const handleMarkAsComplete = async () => {
    setActiveLoading("complete");
    await createOrUpdateQuote({
      moveId,
      updates: {
        status: "completed",
        ...(signatureDataUrl && { repSignature: signatureDataUrl }),
      },
    });
    handleUpdateMoveStatusToBooked();
    setActiveLoading(null);
  };
  const isRepSigned = !!signatureDataUrl || quote?.repSignature;
  const isPrimaryDisabled = quote?.status === isRepSigned;

  const isSecondaryDisabled = quote?.status === isRepSigned;
  const isTertiaryDisabled = move.moveStatus === "Booked" || !isRepSigned;
  return (
    <FormActionContainer>
      <TripleFormAction
        primaryLabel="Email Quote"
        secondaryLabel="Text Quote"
        tertiaryLabel="Mark as Booked"
        secondaryVariant="outline"
        tertiaryVariant="outline"
        onPrimary={(e) => void handleSendQuote(e)}
        onSecondary={handleEditQuote}
        onTertiary={() => void handleMarkAsComplete()}
        primaryLoading={activeLoading === "send"}
        tertiaryLoading={activeLoading === "complete"}
        error={quoteUpdateError || updateMoveError}
        primaryDisabled={isPrimaryDisabled}
        secondaryDisabled={isSecondaryDisabled}
        tertiaryDisabled={isTertiaryDisabled}
      />
    </FormActionContainer>
  );
};

export default QuoteActions;
