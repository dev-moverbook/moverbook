import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  isError: boolean;
  errorMessage?: string | null;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  value,
  onChange,
  options,
  isLoading,
  isError,
  errorMessage,
}) => {
  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading time slots...</p>;
  }

  if (isError || !options) {
    return (
      <p className="text-sm text-red-500">
        {errorMessage || "Failed to load time slots."}
      </p>
    );
  }

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="flex flex-col md:flex-row gap-3 md:gap-10"
    >
      {options.map((option) => (
        <div key={option.value} className="w-full">
          <RadioGroupItem
            value={option.value}
            id={`timeslot-${option.value}`}
            className="sr-only  " // hide the actual radio input
          />
          <Label
            htmlFor={`timeslot-${option.value}`}
            className={clsx(
              "block cursor-pointer rounded-full px-6 py-2 text-center border text-sm font-medium transition-all w-full hover:bg-gray-900",
              value === option.value
                ? "border-green-500 text-white font-semibold"
                : "border-gray-500 text-gray-400"
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
