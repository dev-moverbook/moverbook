"use client";
import { FormEvent, useState } from "react";
import { useCreateOrUpdateQuote } from "@/hooks/quotes";
import { useMoveContext } from "@/contexts/MoveContext";
import { useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";
import FormActions from "@/components/shared/buttons/FormActions";

interface QuoteActionsProps {
  salesRepSignatureDataUrl: string | null;
}

const QuoteActions = ({ salesRepSignatureDataUrl }: QuoteActionsProps) => {
  const [activeLoading, setActiveLoading] = useState<
    "booked" | "sms" | "email" | null
  >(null);
  const { createOrUpdateQuote, quoteUpdateError } = useCreateOrUpdateQuote();
  const { sendPresetScript, sendPresetScriptError, setSendPresetScriptError } =
    useSendPresetScript();

  const { moveData } = useMoveContext();
  const { move, quote } = moveData;
  const { _id: moveId } = move;

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

  const isRepSigned = !!salesRepSignatureDataUrl || quote?.repSignature;

  const isPrimaryDisabled = !isRepSigned;

  const isSecondaryDisabled = quote?.status === isRepSigned;

  return (
    <FormActions
      onSave={(e) => void handleEmailQuote(e)}
      onCancel={() => void handleSmsQuote()}
      saveLabel="Email Quote"
      cancelLabel="Text Quote"
      isSaving={activeLoading === "email"}
      isCanceling={activeLoading === "sms"}
      error={quoteUpdateError || sendPresetScriptError}
      disabled={isPrimaryDisabled}
      cancelDisabled={isSecondaryDisabled}
    />
  );
};

export default QuoteActions;
