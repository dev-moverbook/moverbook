"use client";

import { Doc } from "@/convex/_generated/dataModel";
import CompleteInvoiceButton from "./CompleteInvoiceButton";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import PaymentWrapper from "../stripe/PaymentWrapper";

interface InvoiceConfirmationProps {
  move: Doc<"moves">;
  customerSignatureDataUrl: string | null;
  salesRepSignatureDataUrl: string | null;
  amount: number;
}

const InvoiceConfirmation = ({
  move,
  customerSignatureDataUrl,
  salesRepSignatureDataUrl,
  amount,
}: InvoiceConfirmationProps) => {
  const moveId = move._id;

  const showCreditPayment =
    amount && move.paymentMethod?.kind === "credit_card";

  const isPaymentSuccessful = move.invoicePaid;
  const lastPaymentError = move.invoicePaymentError;

  if (isPaymentSuccessful) {
    return (
      <div>
        <SectionHeader title="Confirmation" />
        <SectionContainer>
          <p>Payment Success!</p>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Confirmation" />
      <SectionContainer>
        {showCreditPayment ? (
          <PaymentWrapper
            error={lastPaymentError}
            amount={amount}
            moveId={move._id}
            type="final_payment"
          />
        ) : (
          <CompleteInvoiceButton
            moveId={moveId}
            customerSignatureDataUrl={customerSignatureDataUrl}
            salesRepSignatureDataUrl={salesRepSignatureDataUrl}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default InvoiceConfirmation;
