import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FieldDisplay from "@/components/shared/FieldDisplay";
import clsx from "clsx";

interface TimeSlotOption {
  label: string;
  value: string;
}

interface TimeSlotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: TimeSlotOption[] | null;
  isLoading: boolean;
  fetchErrorMessage?: string | null;
  isEditing?: boolean;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  value,
  onChange,
  options,
  isLoading,
  fetchErrorMessage,
  isEditing = true,
}) => {
  if (!isEditing) {
    const selectedLabel =
      options?.find((option) => option.value === value)?.label || "—";

    return (
      <FieldDisplay label="Time Slot" value={selectedLabel} fallback="—" />
    );
  }

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading time slots...</p>;
  }

  if (!options) {
    return (
      <p className="text-sm text-red-500">
        {fetchErrorMessage || "Failed to load time slots."}
      </p>
    );
  }

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="flex flex-col md:flex-row gap-3 md:gap-10 mb-4"
    >
      {options.map((option) => (
        <div key={option.value} className="w-full">
          <RadioGroupItem
            value={option.value}
            id={`timeslot-${option.value}`}
            className="sr-only"
          />
          <Label
            htmlFor={`timeslot-${option.value}`}
            className={clsx(
              "block cursor-pointer rounded-full px-6 py-2 text-center border text-sm font-medium transition-all w-full hover:border-greenCustom80 hover:text-[#ffffffcc]",
              value === option.value
                ? "border-greenCustom text-white font-semibold"
                : "border-grayCustom text-grayCustom2"
            )}
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default TimeSlotSelector;
