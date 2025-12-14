"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Id } from "@/convex/_generated/dataModel";
import { useCustomerSignInvoice } from "@/hooks/invoices/useCustomerSignInvoice";

interface PaymentActionsProps {
  invoiceId: Id<"invoices"> | null;
  signature: string | null;
  amount: number | null;
}

const PaymentActions = ({
  invoiceId,
  signature,
  amount,
}: PaymentActionsProps) => {
  const {
    customerSignInvoice,
    customerSignInvoiceError,
    customerSignInvoiceLoading,
  } = useCustomerSignInvoice();

  const handleSubmit = async () => {
    if (!invoiceId || !signature || !amount) {
      return;
    }
    await customerSignInvoice(
      invoiceId,
      signature,
      { kind: "credit_card" },
      amount
    );
  };

  const isDisabled = !signature || !amount;
  return (
    <SingleFormAction
      submitLabel="Submit"
      onSubmit={handleSubmit}
      isSubmitting={customerSignInvoiceLoading}
      error={customerSignInvoiceError}
      disabled={isDisabled}
    />
  );
};

export default PaymentActions;
