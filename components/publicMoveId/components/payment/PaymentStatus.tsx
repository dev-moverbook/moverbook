"use client";

import StepStatus from "@/components/moveId/components/shared/StepStatus";
import { Doc } from "@/convex/_generated/dataModel";
import { getCustomerInvoiceStatus } from "@/frontendUtils/tsxHelper";

interface PaymentStatusProps {
  invoice: Doc<"invoices"> | null;
}

const PaymentStatus = ({ invoice }: PaymentStatusProps) => {
  const paymentStatus = getCustomerInvoiceStatus(invoice);
  return (
    <StepStatus
      items={[
        {
          label: "Payment Status",
          value: paymentStatus.label,
          icon: paymentStatus.icon,
        },
      ]}
    />
  );
};

export default PaymentStatus;
