"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Doc } from "@/convex/_generated/dataModel";
import FieldDisplay from "../field/FieldDisplay";
import FieldErrorMessage from "./FieldErrorMessage";
import { Repeat } from "lucide-react";
import { Button } from "../../ui/button";

interface MoveCheckboxOption {
  label: string;
  value: string;
  getValue?: (move: Doc<"moves">) => string | null;
  onSwap?: () => void;
}

interface LabeledMoveCheckboxGroupProps {
  label: string;
  name: string;
  values: string[];
  options: MoveCheckboxOption[];
  move: Doc<"moves">;
  onChange: (newValues: string[]) => void;
  disabled?: boolean;
  error?: string | null;
  isEditing?: boolean;
  onSwap?: () => void;
}

const LabeledMoveCheckboxGroup: React.FC<LabeledMoveCheckboxGroupProps> = ({
  label,
  name,
  values,
  options,
  move,
  onChange,
  disabled = false,
  error,
  isEditing = true,
  onSwap,
}) => {
  if (!isEditing) {
    const selectedLabels = options
      .filter((opt) => values.includes(opt.value))
      .map((opt) => opt.label)
      .join(", ");

    return (
      <FieldDisplay
        label={label}
        value={selectedLabels || undefined}
        fallback="—"
      />
    );
  }

  const toggleValue = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
    );
  };

  return (
    <div>
      <Label className="">{label}</Label>
      <div className="flex flex-col gap-4 mt-4">
        {options.map((option) => {
          const isEndingLocation = option.value === "endingLocation";

          return (
            <div
              key={option.value}
              className="flex items-start justify-between gap-6"
            >
              <div className="flex items-start space-x-2">
                <Checkbox
                  id={`${name}-${option.value}`}
                  checked={values.includes(option.value)}
                  onCheckedChange={() => toggleValue(option.value)}
                  disabled={disabled}
                  className="border-grayCustom data-[state=checked]:bg-greenCustom data-[state=checked]:border-greenCustom mt-1"
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor={`${name}-${option.value}`}
                    className=" text-white pb-0"
                  >
                    {option.label}
                  </Label>
                  {option.getValue && (
                    <div className=" text-grayCustom2 pl-px">
                      {option.getValue(move) ?? "—"}
                    </div>
                  )}
                </div>
              </div>

              {isEndingLocation && (
                <Button
                  variant="link"
                  onClick={() => onSwap?.()}
                  type="button"
                  className="text-sm underline mt-1 flex flex-row items-center text-white"
                >
                  <Repeat className="text-white w-4 h-4 mr-1 rotate-90" />
                  <span className="text-white">Swap</span>
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledMoveCheckboxGroup;
