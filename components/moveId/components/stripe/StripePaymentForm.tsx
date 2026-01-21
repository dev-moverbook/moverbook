"use client";

import { useState, useEffect } from "react";
import { CompleteCardInfo } from "@/types/types";
import { CardInput } from "./formComponents/CardInput";
import { NewCardOption } from "./formComponents/NewCardOption";
import { PayButton } from "./formComponents/PayButton";
import { PaymentHeader } from "./formComponents/PaymentHeader";
import { SavedCardOption } from "./formComponents/SavedCardOption";
import { useStripePayment } from "@/hooks/stripe";

interface StripePaymentFormProps {
  amount: number;
  createSetupIntent: () => Promise<{ clientSecret: string }>;
  createPaymentIntent: (args: {
    useSavedPaymentMethod: boolean;
    manualPaymentMethodId?: string;
  }) => Promise<void>;
  cardInfo: CompleteCardInfo | null;
  error?: string | null;
  isLoading: boolean;
}

export function StripePaymentForm({
  amount,
  cardInfo,
  createSetupIntent,
  createPaymentIntent,
  error,
  isLoading,
}: StripePaymentFormProps) {
  const {
    submit,
    loading,
    error: stripeError,
  } = useStripePayment({
    createSetupIntent,
    createPaymentIntent,
  });

  const [selection, setSelection] = useState<"saved" | "new">(
    cardInfo ? "saved" : "new"
  );
  const [isCardComplete, setIsCardComplete] = useState<boolean>(false);

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (hasStarted && !loading && !stripeError && !error) {
      timer = setTimeout(() => {
        setIsTimedOut(true);
      }, 10000);
    }

    return () => clearTimeout(timer);
  }, [hasStarted, loading, stripeError, error]);

  const handleSubmit = async () => {
    setIsTimedOut(false);
    setHasStarted(true);
    await submit(selection);
  };

  const isButtonLoading =
    (hasStarted && !stripeError && !error && !isTimedOut) ||
    isLoading ||
    loading;

  const combinedError =
    stripeError ||
    error ||
    (isTimedOut
      ? "Payment authorized, but confirmation is taking longer than expected. Please refresh or check your email."
      : null);

  const isSubmitDisabled =
    isButtonLoading || (selection === "new" && !isCardComplete);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="max-w-md space-y-4 rounded-lg p-6  shadow-sm"
    >
      <PaymentHeader />

      {cardInfo && (
        <SavedCardOption
          cardInfo={cardInfo}
          selected={selection === "saved"}
          onSelect={() => setSelection("saved")}
        />
      )}

      <NewCardOption
        selected={selection === "new"}
        onSelect={() => setSelection("new")}
      />

      {selection === "new" && <CardInput onChange={setIsCardComplete} />}

      <PayButton
        isDisabled={isSubmitDisabled}
        loading={isButtonLoading}
        amount={amount}
        error={combinedError}
      />
    </form>
  );
}
