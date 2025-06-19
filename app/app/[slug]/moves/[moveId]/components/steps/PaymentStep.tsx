import React from "react";
import PaymentHeading from "../payment/PaymentHeading";
import AdditionalFees from "../payment/AdditionalFees";
import Discounts from "../payment/Discounts";
import InvoiceSummary from "../payment/InvoiceSummary";
import InvoiceSignature from "../payment/InnvoiceSignature";
import InternalReview from "../payment/InternalReview";
import ExternalReview from "../payment/ExternalReview";
import { useGetPaymentPage } from "@/app/hooks/queries/useGetPaymentPage";
import FullLoading from "@/app/components/shared/FullLoading";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { MoveSchema } from "@/types/convex-schemas";

interface PaymentStepProps {
  move: MoveSchema;
}

const PaymentStep = ({ move }: PaymentStepProps) => {
  const { _id: moveId } = move;
  const { data, isLoading, isError, errorMessage } = useGetPaymentPage(moveId);

  const { additionalFees, discounts, invoice, internalReview } = data ?? {
    additionalFees: [],
    discounts: [],
    invoice: null,
    internalReview: null,
  };

  if (isLoading) return <FullLoading />;
  if (isError) return <ErrorComponent message={errorMessage} />;

  return (
    <div>
      <PaymentHeading />
      <AdditionalFees additionalFees={additionalFees} moveId={moveId} />
      <Discounts discounts={discounts} moveId={moveId} />
      <InvoiceSummary
        move={move}
        discounts={discounts}
        additionalFees={additionalFees}
      />
      <InvoiceSignature invoice={invoice} move={move} />
      <InternalReview internalReview={internalReview} move={move} />
      <ExternalReview move={move} />
    </div>
  );
};

export default PaymentStep;
