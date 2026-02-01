"use client";

import { useState, useEffect, useMemo } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import ButtonRadioGroup from "@/components/shared/labeled/ButtonRadioGroup";
import { PayButton } from "./formComponents/PayButton";
import { PaymentProcessingStatus } from "./formComponents/PaymentProcessngStatus";
import { CompleteCardInfo } from "@/types/types";

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

  const [selection, setSelection] = useState<"saved" | "new">(
    cardInfo ? "saved" : "new"
  );
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
      setSubmitError("Payment system not ready.");
      return;
    }

    setSubmitError(null);
    setSubmitLoading(true);
    setHasStarted(true);
    setIsTimedOut(false);

    try {
      if (selection === "saved") {
        await createPaymentIntent({ useSavedPaymentMethod: true });
        setIsSuccess(true);
        return;
      }

      const paymentElement = elements.getElement(PaymentElement);

      if (!paymentElement) {
        throw new Error("Payment form is not mounted.");
      }

      await elements.submit();

      const { error: stripeError, setupIntent } =
        await stripe.confirmSetup({
          elements,
          redirect: "if_required",
        });

      if (stripeError){
        throw stripeError;
      }

      if (!setupIntent?.payment_method) {
        throw new Error("No payment method returned from Stripe.");
      }

      await createPaymentIntent({
        useSavedPaymentMethod: false,
        manualPaymentMethodId: setupIntent.payment_method as string,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error("Payment Error:", err);
      setSubmitError( "Payment failed.");
      setHasStarted(false);
    } finally {
      setSubmitLoading(false);
    }
  };

  const isProcessing =
    (hasStarted && submitLoading) || (hasStarted && isSuccess) || isLoading;

  const combinedError =
    submitError ||
    error ||
    (isTimedOut ? "Confirmation is taking longer than expected." : null);

  const isSubmitDisabled =
    isProcessing || (selection === "new" && (!isComplete || !isReady));

    return (
      <div className="relative">
        {isProcessing && !isTimedOut && (
            <PaymentProcessingStatus />
        )}
    
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className={` ${
            isProcessing ? "hidden" : ""
          }`}
        >
          <ButtonRadioGroup
            label="Payment Method"
            name="paymentMethod"
            options={paymentOptions}
            value={selection}
            layout="vertical"
            isEditing={!isProcessing}
            onChange={(value) => {
              setSelection(value as "saved" | "new");
              setIsComplete(false);
              setIsReady(false);
            }}
          />
    
          {selection === "new" && (
            <div className="mt-4">
              <PaymentElement
                key="new-payment-element"
                options={{ layout: "tabs" }}
                onChange={(e) => setIsComplete(e.complete)}
                onReady={() => setIsReady(true)}
              />
            </div>
          )}
    
          <PayButton
            isDisabled={isSubmitDisabled}
            amount={amount}
            error={combinedError}
          />
        </form>
      </div>
    );
}
