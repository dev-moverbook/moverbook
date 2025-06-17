import React, { FormEvent, useState } from "react";
import TripleFormAction from "@/app/components/shared/buttons/TripleFormAction";
import { useCreateOrUpdateQuote } from "../../../hooks/useCreateOrUpdateQuote";
import { Id } from "@/convex/_generated/dataModel";

interface QuoteActionsProps {
  onEditQuote: () => void;
  signatureDataUrl: string | null;
  moveId: Id<"move">;
}

const QuoteActions = ({
  onEditQuote,
  signatureDataUrl,
  moveId,
}: QuoteActionsProps) => {
  const [activeLoading, setActiveLoading] = useState<
    "send" | "complete" | null
  >(null);
  const { createOrUpdateQuote, quoteUpdateError } = useCreateOrUpdateQuote();

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
    setActiveLoading(null);
  };

  return (
    <div className="max-w-screen-sm mx-auto md:px-0 px-4 mt-4">
      <TripleFormAction
        primaryLabel="Send Quote"
        secondaryLabel="Edit Quote"
        tertiaryLabel="Mark as Complete"
        secondaryVariant="outline"
        tertiaryVariant="outline"
        onPrimary={(e) => void handleSendQuote(e)}
        onSecondary={handleEditQuote}
        onTertiary={() => void handleMarkAsComplete()}
        primaryLoading={activeLoading === "send"}
        tertiaryLoading={activeLoading === "complete"}
        disabled={!signatureDataUrl}
        error={quoteUpdateError}
      />
    </div>
  );
};

export default QuoteActions;
