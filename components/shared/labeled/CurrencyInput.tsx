import { NumericFormat } from "react-number-format";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "../field/FieldDisplay";
import { formatCurrency } from "@/frontendUtils/helper";
import { Label } from "@radix-ui/react-label";

interface CurrencyInputProps {
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  isEditing?: boolean;
  error?: string | null;
  suffix?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  isEditing = true,
  error,
  suffix,
}) => {
  if (!isEditing) {
    return (
      <FieldDisplay
        label={label ?? ""}
        value={value !== null ? `${formatCurrency(value)}${suffix ?? ""}` : ""}
        fallback="N/A"
      />
    );
  }
  return (
    <div>
      {label && (
        <Label className="block text-sm font-medium pb-1 text-white">
          {label}
        </Label>
      )}
      <NumericFormat
        value={value === null ? "" : value}
        onValueChange={(values) => {
          if (values.value === "") {
            onChange(null); // handle empty input
          } else {
            const numericValue = values.floatValue ?? 0;
            onChange(numericValue);
          }
        }}
        thousandSeparator
        decimalScale={2}
        fixedDecimalScale
        prefix="$"
        suffix={suffix}
        allowNegative={false}
        placeholder="$0.00"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        disabled={!isEditing}
        className={`placeholder:text-grayCustom2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full rounded-md border px-2 py-1 text-base bg-transparent text-white ${
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-grayCustom"
        }`}
      />
      <FieldErrorMessage error={error} />{" "}
    </div>
  );
};

export default CurrencyInput;
