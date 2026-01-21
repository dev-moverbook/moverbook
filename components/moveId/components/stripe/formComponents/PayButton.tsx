"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";

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
  return (
    <SingleFormAction
      isSubmitting={loading}
      submitLabel={`Pay $${amount.toFixed(2)}`}
      error={error}
      submitVariant="default"
      disabled={isDisabled}
    />
  );
}
