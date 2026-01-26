import { CardElement } from "@stripe/react-stripe-js";

interface CardInputProps {
  onChange: (complete: boolean) => void;
}

export function CardInput({ onChange }: CardInputProps) {
  return (
    <div className="rounded-md border border-grayCustom p-3">
      <CardElement
        options={{
          iconStyle: "solid",
          style: {
            base: {
              color: "#ffffff",
              fontSize: "16px",
              "::placeholder": {
                color: "#aaaaaa",
              },
              iconColor: "#ffffff",
            },
            invalid: {
              color: "#ef4444",
              iconColor: "#ef4444",
            },
          },
        }}
        onChange={(e) => onChange(e.complete)}
      />
    </div>
  );
}
