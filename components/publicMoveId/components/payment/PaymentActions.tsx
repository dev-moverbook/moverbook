"use client";

import PaymentWrapper from "@/components/moveId/components/stripe/PaymentWrapper";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import PaymentSuccess from "@/components/moveId/components/stripe/formComponents/PaymentSuccess";

interface InvoicePaymentSectionProps {
  move: Doc<"moves">;
  amount: number;
}
const InvoicePaymentSection = ({
  move,
  amount,
}: InvoicePaymentSectionProps) => {
  const isPaymentSuccessful = move.invoicePaid;
  const lastPaymentError = move.invoicePaymentError;

  if (isPaymentSuccessful) {
    return <PaymentSuccess />;
  }
  return (
    <div>
      <SectionHeader className="mx-auto" title="Confirmation" />
      <SectionContainer showBorder={false}>
        <PaymentWrapper
          error={lastPaymentError}
          amount={amount}
          moveId={move._id}
          type="final_payment"
        />
      </SectionContainer>
    </div>
  );
};

export default InvoicePaymentSection;
