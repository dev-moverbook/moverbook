import { NumericFormat } from "react-number-format";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "../FieldDisplay";
import { formatCurrency } from "@/app/frontendUtils/helper";

interface CurrencyInputProps {
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  isEditing?: boolean;
  error?: string | null;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  isEditing = true,
  error,
}) => {
  if (!isEditing) {
    return (
      <FieldDisplay
        label={label ?? ""}
        value={formatCurrency(value ?? 0)}
        fallback="N/A"
      />
    );
  }
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-white">{label}</label>
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
        allowNegative={false}
        placeholder="$0.00"
        disabled={!isEditing}
        className={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full rounded-md border px-2 py-1 text-base bg-transparent text-white ${
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
