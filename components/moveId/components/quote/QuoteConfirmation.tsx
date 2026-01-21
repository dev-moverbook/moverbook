"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import PaymentWrapper from "../stripe/PaymentWrapper";
import BookingButton from "./BookingButton";

interface QuoteConfirmationProps {
  move: Doc<"moves">;
  customerSignatureDataUrl: string | null;
  salesRepSignatureDataUrl: string | null;
}
const QuoteConfirmation = ({
  move,
  customerSignatureDataUrl,
  salesRepSignatureDataUrl,
}: QuoteConfirmationProps) => {
  const showCreditPayment =
    move.deposit &&
    move.deposit > 0 &&
    move.paymentMethod?.kind === "credit_card";

  const isPaymentSuccessful = move.depositPaid;
  const lastPaymentError = move.depositPaymentError;

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
            amount={move.deposit ?? 0}
            moveId={move._id}
          />
        ) : (
          <BookingButton
            moveId={move._id}
            customerSignatureDataUrl={customerSignatureDataUrl}
            salesRepSignatureDataUrl={salesRepSignatureDataUrl}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default QuoteConfirmation;
