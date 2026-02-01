"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { formatCurrency } from "@/frontendUtils/helper";

interface PayButtonProps {
  amount: number;
  error: string | null;
  isDisabled: boolean;
}

export function PayButton({
  amount,
  error,
  isDisabled,
}: PayButtonProps) {
  return (
    <SingleFormAction
      submitLabel={`Pay ${formatCurrency(amount)}`}
      error={error}
      submitVariant="default"
      disabled={isDisabled}
    />
  );
}
