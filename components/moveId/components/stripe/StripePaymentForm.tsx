"use client";

import { useState, useEffect, useMemo } from "react";
import { CompleteCardInfo } from "@/types/types";
import { CardInput } from "./formComponents/CardInput";
import { PayButton } from "./formComponents/PayButton";
import { useStripePayment } from "@/hooks/stripe";
import ButtonRadioGroup from "@/components/shared/labeled/ButtonRadioGroup";
import { Label } from "@/components/ui/label";

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

  const [selection, setSelection] = useState<string>(
    cardInfo ? "saved" : "new"
  );
  const [isCardComplete, setIsCardComplete] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  const paymentOptions = useMemo(() => {
    const opts = [];

    if (cardInfo) {
      opts.push({
        label: `${cardInfo.brand} •••• ${cardInfo.last4} (exp ${cardInfo.expMonth}/${cardInfo.expYear})`,
        value: "saved",
      });
    }

    opts.push({
      label: "New Card",
      value: "new",
    });

    return opts;
  }, [cardInfo]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasStarted && !loading && !stripeError && !error) {
      timer = setTimeout(() => setIsTimedOut(true), 10000);
    }
    return () => clearTimeout(timer);
  }, [hasStarted, loading, stripeError, error]);

  const handleSubmit = async () => {
    setIsTimedOut(false);
    setHasStarted(true);
    await submit(selection as "saved" | "new");
  };

  const isButtonLoading =
    (hasStarted && !stripeError && !error && !isTimedOut) ||
    isLoading ||
    loading;

  const combinedError =
    stripeError ||
    error ||
    (isTimedOut
      ? "Payment authorized, but confirmation is taking longer than expected."
      : null);

  const isSubmitDisabled =
    isButtonLoading || (selection === "new" && !isCardComplete);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="max-w-md space-y-6 rounded-lg  shadow-sm"
    >
      <ButtonRadioGroup
        label="Payment Method"
        name="paymentMethod"
        options={paymentOptions}
        value={selection}
        onChange={(value) => setSelection(value as "saved" | "new")}
        layout="vertical"
        isEditing={!isButtonLoading}
      />

      {selection === "new" && (
        <div className="">
          <Label
            className="text-white  font-medium mb-2 block"
            id="card-information"
          >
            Card Information
          </Label>
          <CardInput onChange={setIsCardComplete} />
        </div>
      )}

      <PayButton
        isDisabled={isSubmitDisabled}
        loading={isButtonLoading}
        amount={amount}
        error={combinedError}
      />
    </form>
  );
}
