import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface MonthDayPickerProps {
  label: string;
  month: string;
  day: string;
  onChange: (month: string, day: string) => void;
}

const MonthDayPicker: React.FC<MonthDayPickerProps> = ({
  label,
  month,
  day,
  onChange,
}) => {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex gap-4">
        <div className="flex flex-col">
          <Label className="text-xs text-muted-foreground">Month</Label>
          <Select
            value={month}
            onValueChange={(newMonth) => {
              onChange(newMonth, day);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue>{month !== "none" ? month : "–"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">–</SelectItem>
              {[...Array(12)].map((_, i) => {
                const val = String(i + 1);
                return (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label className="text-xs text-muted-foreground">Day</Label>
          <Select
            value={day}
            onValueChange={(newDay) => {
              onChange(month, newDay);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue>{day !== "none" ? day : "–"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">–</SelectItem>
              {[...Array(31)].map((_, i) => {
                const val = String(i + 1);
                return (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MonthDayPicker;
