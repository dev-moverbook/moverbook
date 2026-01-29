"use client";

import { useState, useEffect, useMemo } from "react";
import { CompleteCardInfo } from "@/types/types";
import { PayButton } from "./formComponents/PayButton";
import ButtonRadioGroup from "@/components/shared/labeled/ButtonRadioGroup";
import { Label } from "@/components/ui/label";
import { PaymentProcessingStatus } from "./formComponents/PaymentProcessngStatus";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  amount: number;
  cardInfo: CompleteCardInfo | null;
  createPaymentIntent: (args: {
    useSavedPaymentMethod: boolean;
    manualPaymentMethodId?: string;
  }) => Promise<void>;
  error?: string | null;
  isLoading: boolean;
}

export function StripePaymentForm({
  amount,
  cardInfo,
  createPaymentIntent,
  error,
  isLoading,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [selection, setSelection] = useState<string>(cardInfo ? "saved" : "new");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const paymentOptions = useMemo(() => {
    const opts = [];
    if (cardInfo) {
      opts.push({
        label: `${cardInfo.brand} •••• ${cardInfo.last4} (exp ${cardInfo.expMonth}/${cardInfo.expYear})`,
        value: "saved",
      });
    }
    opts.push({ label: "New Card", value: "new" });
    return opts;
  }, [cardInfo]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasStarted && submitLoading && !isSuccess) {
      timer = setTimeout(() => setIsTimedOut(true), 12000);
    }
    return () => clearTimeout(timer);
  }, [hasStarted, submitLoading, isSuccess]);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      setSubmitError("Stripe has not loaded properly.");
      return;
    }

    setIsTimedOut(false);
    setHasStarted(true);
    setSubmitError(null);
    setSubmitLoading(true);

    try {
      if (selection === "saved") {
        await createPaymentIntent({ useSavedPaymentMethod: true });
        setIsSuccess(true);
      } else {
        const { error: stripeErr, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: {
          },
          redirect: "if_required",
        });

        if (stripeErr){
          throw stripeErr;
        }

        if (!setupIntent?.payment_method) {
          throw new Error("No payment method returned from Stripe.");
        }

        await createPaymentIntent({
          useSavedPaymentMethod: false,
          manualPaymentMethodId: setupIntent.payment_method as string,
        });
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setHasStarted(false);
    } finally {
      setSubmitLoading(false);
    }
  };

  const isProcessing = (hasStarted && submitLoading) || (hasStarted && isSuccess) || isLoading;
  const combinedError = submitError || error || (isTimedOut ? "Confirmation taking longer than expected." : null);
  
  const isSubmitDisabled = isProcessing || (selection === "new" && (!isComplete || !isReady));

  if(isProcessing && !isTimedOut) {
    return <PaymentProcessingStatus />
  }

  return (
    <div className="relative">
    

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={`space-y-6 rounded-lg shadow-sm ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <ButtonRadioGroup
          label="Payment Method"
          name="paymentMethod"
          options={paymentOptions}
          value={selection}
          onChange={(value) => setSelection(value as "saved" | "new")}
          layout="vertical"
          isEditing={!isProcessing}
        />
        <div className={selection === "new" ? "block" : "hidden"}>
          <Label id="payment-information" className="mb-3 ">
            Card Information
          </Label>
          <div className="">
            <PaymentElement
              options={{ layout: "tabs" }}
              onChange={(e) => setIsComplete(e.complete)}
              onReady={() => setIsReady(true)}
            />
          </div>
        </div>

        <PayButton
          isDisabled={isSubmitDisabled}
          loading={isProcessing}
          amount={amount}
          error={combinedError}
        />
      </form>
    </div>
  );
}