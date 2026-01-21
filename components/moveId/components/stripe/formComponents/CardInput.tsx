import { CardElement } from "@stripe/react-stripe-js";

interface CardInputProps {
  onChange: (complete: boolean) => void;
}

export function CardInput({ onChange }: CardInputProps) {
  return (
    <div className="rounded-md border border-grayCustom p-3">
      <CardElement
        options={{
          hidePostalCode: true,
          style: {
            base: {
              color: "#ffffff",
            },
          },
        }}
        onChange={(e) => onChange(e.complete)}
      />
    </div>
  );
}
