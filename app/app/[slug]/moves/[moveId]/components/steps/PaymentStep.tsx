"use client";

import AdditionalFees from "../payment/AdditionalFees";
import Discounts from "../payment/Discounts";
import InvoiceSummary from "../payment/InvoiceSummary";
import InvoiceSignature from "../payment/InvoiceSignature";
import InternalReview from "../payment/InternalReview";
import ExternalReview from "../payment/ExternalReview";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import StepStatus from "../shared/StepStatus";
import { getInvoiceStatus } from "@/app/frontendUtils/tsxHelper";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { QueryStatus } from "@/types/enums";
import { useGetPaymentPage } from "@/app/hooks/queries/useGetPaymentPage";

const PaymentStep = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { _id: moveId } = move;

  const result = useGetPaymentPage(moveId);

  switch (result.status) {
    case QueryStatus.LOADING:
      return null;

    case QueryStatus.ERROR:
      return <ErrorComponent message={result.errorMessage} />;

    case QueryStatus.SUCCESS: {
      const {
        additionalFees = [],
        discounts = [],
        invoice = null,
        internalReview = null,
        fees = [],
      } = result.data ?? {};

      const invoiceStatus = getInvoiceStatus(invoice);

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
    }
  }
};

export default PaymentStep;
