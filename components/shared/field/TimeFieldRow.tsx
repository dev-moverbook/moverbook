import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import FieldDisplay from "./FieldDisplay";
import { formatTime } from "@/frontendUtils/luxonUtils";

interface TimeRangeFieldRowProps {
  label: string;
  startName: string;
  endName: string;
  startValue?: string | null;
  endValue?: string | null;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorStart?: string;
  errorEnd?: string;
  fallback?: string;
}

const TimeRangeFieldRow: React.FC<TimeRangeFieldRowProps> = ({
  label,
  startName,
  endName,
  startValue = "",
  endValue = "",
  isEditing = true,
  onChange,
  errorStart,
  errorEnd,
  fallback = "N/A",
}) => {
  if (isEditing) {
    return (
      <div className="space-y-1">
        <Label className="text-white">{label}</Label>
        <div className="flex items-end gap-2">
          <Input
            type="time"
            id={startName}
            name={startName}
            value={startValue ?? ""}
            onChange={onChange}
            aria-label="Start time"
            className={cn(
              "bg-transparent text-white border border-gray-600 px-3 py-2 text-base w-full focus-visible:ring-1 focus-visible:ring-white",
              errorStart && "border-red-500"
            )}
          />
          <div className="pb-2 text-white">-</div>
          <Input
            type="time"
            id={endName}
            name={endName}
            value={endValue ?? ""}
            onChange={onChange}
            aria-label="End time"
            className={cn(
              "bg-transparent text-white border border-gray-600 px-3 py-2 text-base w-full focus-visible:ring-1 focus-visible:ring-white",
              errorEnd && "border-red-500"
            )}
          />
        </div>
        {(errorStart || errorEnd) && (
          <p className="text-sm text-red-500 mt-1">{errorStart || errorEnd}</p>
        )}
      </div>
    );
  }

  return (
    <FieldDisplay
      label={label}
      value={
        startValue && endValue
          ? `${formatTime(startValue)} - ${formatTime(endValue)}`
          : null
      }
      fallback={fallback}
    />
  );
};

// Optional: format "HH:mm" to "h:mm AM/PM"

export default TimeRangeFieldRow;
