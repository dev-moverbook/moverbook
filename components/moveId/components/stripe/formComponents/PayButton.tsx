"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { formatCurrency } from "@/frontendUtils/helper";

interface PayButtonProps {
  loading: boolean;
  amount: number;
  error: string | null;
  isDisabled: boolean;
}

export function PayButton({
  loading,
  amount,
  error,
  isDisabled,
}: PayButtonProps) {
  console.log('loading', loading);
  return (
    <SingleFormAction
      submitLabel={`Pay ${formatCurrency(amount)}`}
      error={error}
      submitVariant="default"
      disabled={isDisabled}
    />
  );
}
