"use client";

import PaymentWrapper from "@/components/moveId/components/stripe/PaymentWrapper";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import PaymentSuccess from "@/components/moveId/components/stripe/formComponents/PaymentSuccess";

interface DepositPaymentSectionProps {
  move: Doc<"moves">;
}
const DepositPaymentSection = ({ move }: DepositPaymentSectionProps) => {
  const isPaymentSuccessful = move.depositPaid;
  const lastPaymentError = move.depositPaymentError;

  if (isPaymentSuccessful) {
    return <PaymentSuccess />;
  }
  return (
    <div>
      <SectionHeader className="mx-auto" title="Confirmation" />
      <SectionContainer>
        <PaymentWrapper
          error={lastPaymentError}
          amount={move.deposit ?? 0}
          moveId={move._id}
          type="deposit"
        />
      </SectionContainer>
    </div>
  );
};

export default DepositPaymentSection;
