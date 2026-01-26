"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import InvoiceSave from "./InvoiceSave";
import { Doc } from "@/convex/_generated/dataModel";
import InvoiceCommunication from "./InvoiceCommunication";

interface InvoiceActionsProps {
  salesRepSignatureDataUrl: string | null;
  customerSignatureDataUrl: string | null;
  onSuccess: () => void;
  invoice: Doc<"invoices"> | null;
  amount: number;
}

const InvoiceActions = ({
  salesRepSignatureDataUrl,
  customerSignatureDataUrl,
  onSuccess,
  invoice,
  amount,
}: InvoiceActionsProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const hasUnsavedChanges = !!(
    salesRepSignatureDataUrl || customerSignatureDataUrl
  );

  if (hasUnsavedChanges) {
    return (
      <InvoiceSave
        moveId={move._id}
        invoice={invoice}
        salesRepSignatureDataUrl={salesRepSignatureDataUrl}
        customerSignatureDataUrl={customerSignatureDataUrl}
        onSuccess={onSuccess}
      />
    );
  }

  return <InvoiceCommunication move={move} invoice={invoice} amount={amount} />;
};

export default InvoiceActions;
