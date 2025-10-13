"use client";

import AdditionalFees from "../payment/AdditionalFees";
import Discounts from "../payment/Discounts";
import InvoiceSummary from "../payment/InvoiceSummary";
import InvoiceSignature from "../payment/InvoiceSignature";
import InternalReview from "../payment/InternalReview";
import ExternalReview from "../payment/ExternalReview";
import StepStatus from "../shared/StepStatus";
import { getInvoiceStatus } from "@/app/frontendUtils/tsxHelper";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { useGetPaymentPage } from "@/app/hooks/queries/useGetPaymentPage";
import { computeFinalMoveCost } from "@/app/frontendUtils/payout";
import InvoiceNotReady from "../shared/InvoiceNotReady";

const PaymentStep = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { _id: moveId } = move;

  const result = useGetPaymentPage(moveId);

  switch (result) {
    case undefined:
      return null;

    default: {
      const {
        additionalFees = [],
        discounts = [],
        invoice = null,
        internalReview = null,
        fees = [],
      } = result ?? {};

      const invoiceStatus = getInvoiceStatus(invoice, move);
      const {
        moveFees,
        jobType,
        jobTypeRate,
        liabilityCoverage,
        segmentDistances,
        travelFeeRate,
        travelFeeMethod,
        paymentMethod,
        creditCardFee,
        actualBreakTime,
        actualStartTime,
        actualEndTime,
        actualArrivalTime,
        deposit,
      } = move;

      const { items, total } = computeFinalMoveCost({
        moveFees,
        jobType,
        jobTypeRate: jobTypeRate ?? 0,
        liabilityCoverage,
        segmentDistances,
        travelFeeRate: travelFeeRate ?? null,
        travelFeeMethod: travelFeeMethod ?? null,
        paymentMethod,
        creditCardFee,
        actualBreakTime: actualBreakTime ?? 0,
        actualStartTime: actualStartTime ?? 0,
        actualEndTime: actualEndTime ?? 0,
        actualArrivalTime: actualArrivalTime ?? 0,
        additionalFees,
        discounts,
        deposit: deposit ?? 0,
      });

      const showInvoice =
        !!actualStartTime && !!actualArrivalTime && !!actualEndTime;

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
          {showInvoice ? (
            <>
              <InvoiceSummary items={items} total={total} />
              <InvoiceSignature invoice={invoice} move={move} total={total} />
              <InternalReview internalReview={internalReview} move={move} />
              <ExternalReview move={move} />
            </>
          ) : (
            <InvoiceNotReady />
          )}
        </div>
      );
    }
  }
};

export default PaymentStep;
