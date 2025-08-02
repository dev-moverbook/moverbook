import AdditionalFees from "../payment/AdditionalFees";
import Discounts from "../payment/Discounts";
import InvoiceSummary from "../payment/InvoiceSummary";
import InvoiceSignature from "../payment/InvoiceSignature";
import InternalReview from "../payment/InternalReview";
import ExternalReview from "../payment/ExternalReview";
import { useGetPaymentPage } from "@/app/hooks/queries/useGetPaymentPage";
import FullLoading from "@/app/components/shared/FullLoading";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { Doc } from "@/convex/_generated/dataModel";
import { getInvoiceStatus } from "@/app/frontendUtils/tsxHelper";
import StepStatus from "../shared/StepStatus";

interface PaymentStepProps {
  move: Doc<"move">;
}

const PaymentStep = ({ move }: PaymentStepProps) => {
  const { _id: moveId } = move;
  const { data, isLoading, isError, errorMessage } = useGetPaymentPage(moveId);

  const { additionalFees, discounts, invoice, internalReview, fees } = data ?? {
    additionalFees: [],
    discounts: [],
    invoice: null,
    internalReview: null,
    fees: [],
  };

  const invoiceStatus = getInvoiceStatus(invoice);

  if (isLoading) return <FullLoading />;
  if (isError) return <ErrorComponent message={errorMessage} />;

  return (
    <div>
      <StepStatus
        items={[
          {
            label: "Invoice Status",
            value: invoiceStatus.label,
            icon: invoiceStatus.icon,
          },
        ]}
      />
      <AdditionalFees
        additionalFees={additionalFees}
        moveId={moveId}
        fees={fees}
      />
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
