"use client";
import { FormEvent, useState } from "react";
import TripleFormAction from "@/components/shared/buttons/TripleFormAction";
import { useCreateOrUpdateQuote } from "@/hooks/quotes";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import { useUpdateMove } from "@/hooks/moves";
import { useMoveContext } from "@/contexts/MoveContext";
import { useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";

interface QuoteActionsProps {
  salesRepSignatureDataUrl: string | null;
  customerSignatureDataUrl: string | null;
}

const QuoteActions = ({
  salesRepSignatureDataUrl,
  customerSignatureDataUrl,
}: QuoteActionsProps) => {
  const [activeLoading, setActiveLoading] = useState<
    "booked" | "sms" | "email" | null
  >(null);
  const { createOrUpdateQuote, quoteUpdateError } = useCreateOrUpdateQuote();
  const { updateMove, updateMoveError } = useUpdateMove();
  const { sendPresetScript, sendPresetScriptError, setSendPresetScriptError } =
    useSendPresetScript();

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
    setSendPresetScriptError(null);
    setActiveLoading("email");
    await createOrUpdateQuote({
      moveId,
      updates: {
        status: "pending",
        ...(salesRepSignatureDataUrl && {
          repSignature: salesRepSignatureDataUrl,
        }),
      },
    });
    await sendPresetScript({
      moveId,
      preSetTypes: PresSetScripts.EMAIL_QUOTE,
    });
    setActiveLoading(null);
  };

  const handleSmsQuote = async () => {
    setSendPresetScriptError(null);
    setActiveLoading("sms");
    await createOrUpdateQuote({
      moveId,
      updates: {
        status: "pending",
        ...(salesRepSignatureDataUrl && {
          repSignature: salesRepSignatureDataUrl,
        }),
      },
    });
    await sendPresetScript({
      moveId,
      preSetTypes: PresSetScripts.SMS_QUOTE,
    });
    setActiveLoading(null);
  };

  const handleMarkAsComplete = async () => {
    setSendPresetScriptError(null);
    setActiveLoading("booked");
    await createOrUpdateQuote({
      moveId,
      updates: {
        status: "completed",
        ...(customerSignatureDataUrl && {
          customerSignature: customerSignatureDataUrl,
        }),
        ...(salesRepSignatureDataUrl && {
          repSignature: salesRepSignatureDataUrl,
        }),
      },
    });
    handleUpdateMoveStatusToBooked();
    setActiveLoading(null);
  };
  const isRepSigned = !!salesRepSignatureDataUrl || quote?.repSignature;

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
        error={quoteUpdateError || updateMoveError || sendPresetScriptError}
        primaryDisabled={isPrimaryDisabled}
        secondaryDisabled={isSecondaryDisabled}
        tertiaryDisabled={isTertiaryDisabled}
      />
    </FormActionContainer>
  );
};

export default QuoteActions;
