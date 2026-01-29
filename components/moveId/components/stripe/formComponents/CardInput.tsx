"use client";

import { useImperativeHandle, forwardRef, useRef } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";

export interface CardInputRef {
  getElement: () => StripeCardElement | null;
}

interface CardInputProps {
  onChange: (complete: boolean) => void;
  onReady?: () => void;
}

const CardInput = forwardRef<CardInputRef, CardInputProps>(
  ({ onChange, onReady }, ref) => {
    const elementRef = useRef<StripeCardElement | null>(null);

    useImperativeHandle(ref, () => ({
      getElement: () => elementRef.current,
    }));

    return (
      <div className="rounded-md border border-grayCustom p-3">
        <CardElement
          options={{
            iconStyle: "solid",
            style: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                "::placeholder": { color: "#aaaaaa" },
                iconColor: "#ffffff",
              },
              invalid: {
                color: "#ef4444",
                iconColor: "#ef4444",
              },
            },
          }}
          onChange={(e) => onChange(e.complete)}
          onReady={(el) => {
            elementRef.current = el;
            onReady?.();
          }}
        />
      </div>
    );
  }
);

CardInput.displayName = "CardInput";

export { CardInput };
