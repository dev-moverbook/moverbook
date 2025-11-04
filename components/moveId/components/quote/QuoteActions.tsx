"use client";
import { FormEvent, useState } from "react";
import TripleFormAction from "@/components/shared/buttons/TripleFormAction";
import { useCreateOrUpdateQuote } from "@/hooks/quotes";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import { useUpdateMove } from "@/hooks/moves";
import { useMoveContext } from "@/contexts/MoveContext";
import { useSendQuote } from "@/hooks/quotes";

interface QuoteActionsProps {
  signatureDataUrl: string | null;
}

const QuoteActions = ({ signatureDataUrl }: QuoteActionsProps) => {
  const [activeLoading, setActiveLoading] = useState<
    "booked" | "sms" | "email" | null
  >(null);
  const { createOrUpdateQuote, quoteUpdateError } = useCreateOrUpdateQuote();
  const { sendQuote, sendQuoteError, setSendQuoteError } = useSendQuote();
  const { updateMove, updateMoveError } = useUpdateMove();

  const { moveData } = useMoveContext();
  const { move, quote } = moveData;
  const { _id: moveId, moveStatus } = move;

  const handleUpdateMoveStatusToBooked = async () => {
    if (moveStatus === "Quoted" || moveStatus === "New Lead") {
      await updateMove({
        moveId,
        updates: { moveStatus: "Booked" },
      });
    }
  };

  const handleEmailQuote = async (e: FormEvent) => {
    e.preventDefault();
    setSendQuoteError(null);
    setActiveLoading("email");
    await createOrUpdateQuote({
      moveId,
      updates: {
        status: "pending",
        ...(signatureDataUrl && { repSignature: signatureDataUrl }),
      },
    });
    await sendQuote(moveId, "email");
    setActiveLoading(null);
  };

  const handleSmsQuote = async () => {
    setSendQuoteError(null);
    setActiveLoading("sms");
    await createOrUpdateQuote({
      moveId,
      updates: {
        status: "pending",
        ...(signatureDataUrl && { repSignature: signatureDataUrl }),
      },
    });
    await sendQuote(moveId, "sms");
    setActiveLoading(null);
  };

  const handleMarkAsComplete = async () => {
    setSendQuoteError(null);
    setActiveLoading("booked");
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

  const isPrimaryDisabled = !isRepSigned;

  const isSecondaryDisabled = quote?.status === isRepSigned;
  const isTertiaryDisabled =
    move.moveStatus === "Booked" ||
    !isRepSigned ||
    move.moveStatus === "Completed";

  return (
    <FormActionContainer>
      <TripleFormAction
        primaryLabel="Email Quote"
        secondaryLabel="Text Quote"
        tertiaryLabel="Mark as Booked"
        secondaryVariant="outline"
        tertiaryVariant="outline"
        onPrimary={(e) => void handleEmailQuote(e)}
        onSecondary={handleSmsQuote}
        onTertiary={() => void handleMarkAsComplete()}
        primaryLoading={activeLoading === "email"}
        tertiaryLoading={activeLoading === "booked"}
        secondaryLoading={activeLoading === "sms"}
        error={quoteUpdateError || updateMoveError || sendQuoteError}
        primaryDisabled={isPrimaryDisabled}
        secondaryDisabled={isSecondaryDisabled}
        tertiaryDisabled={isTertiaryDisabled}
      />
    </FormActionContainer>
  );
};

export default QuoteActions;
