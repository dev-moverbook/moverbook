"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import PaymentActions from "./PaymentActions";
import { useState } from "react";
import InvoiceCustomerSignature from "./InvoiceCustomerSignature";
import InvoiceSummary from "@/components/moveId/components/payment/InvoiceSummary";
import { computeFinalMoveCost } from "@/frontendUtils/payout";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import SaveCustomerInvoice from "./SaveCustomerInvoice";

const PaymentStep = () => {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const { move } = usePublicMoveIdContext();
  const invoice = move.invoice;
  const additionalFees = move.additionalFees;
  const discounts = move.discounts;
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
  } = move.move;

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

  const showInvoice = invoice && invoice.repSignature;
  const showPaymentActions =
    invoice?.status === "completed" && paymentMethod?.kind === "credit_card";
  return (
    <div>
      <SectionContainer className="px-0 pt-0">
        {showInvoice ? (
          <>
            <InvoiceSummary items={items} total={total} />
            <InvoiceCustomerSignature
              invoice={invoice}
              setSignatureDataUrl={setSignatureDataUrl}
            />
            {signatureDataUrl && invoice && (
              <SaveCustomerInvoice
                invoiceId={invoice._id}
                signature={signatureDataUrl}
                setSignatureDataUrl={setSignatureDataUrl}
              />
            )}
            {showPaymentActions && (
              <PaymentActions amount={total} move={move.move} />
            )}
          </>
        ) : (
          <p>Invoice not ready.</p>
        )}
      </SectionContainer>
    </div>
  );
};

export default PaymentStep;
