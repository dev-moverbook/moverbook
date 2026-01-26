"use client";

import AdditionalFees from "../payment/AdditionalFees";
import Discounts from "../payment/Discounts";
import StepStatus from "../shared/StepStatus";
import { getInvoiceStatus } from "@/frontendUtils/tsxHelper";
import { useMoveContext } from "@/contexts/MoveContext";
import { useGetPaymentPage } from "@/hooks/paymentPage";
import { computeFinalMoveCost } from "@/frontendUtils/payout";
import InvoiceNotReady from "../shared/InvoiceNotReady";
import InoviceSection from "../payment/InoviceSection";
import SectionContainer from "@/components/shared/containers/SectionContainer";

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
        moveFees: moveFees ?? [],
        jobType: jobType ?? "hourly",
        jobTypeRate: jobTypeRate ?? 0,
        liabilityCoverage: liabilityCoverage ?? null,
        segmentDistances: segmentDistances ?? [],
        travelFeeRate: travelFeeRate ?? null,
        travelFeeMethod: travelFeeMethod ?? null,
        paymentMethod: paymentMethod ?? { kind: "other", label: "Other" },
        creditCardFee: creditCardFee ?? 0,
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
        <SectionContainer showBorder={false} className="px-0">
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
            <InoviceSection
              items={items}
              total={total}
              invoice={invoice}
              move={move}
              internalReview={internalReview}
            />
          ) : (
            <InvoiceNotReady />
          )}
        </SectionContainer>
      );
    }
  }
};

export default PaymentStep;
