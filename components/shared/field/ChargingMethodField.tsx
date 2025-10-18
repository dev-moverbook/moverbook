import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TravelChargingTypes } from "@/types/enums";

interface ChargingMethodFieldProps {
  value: TravelChargingTypes;
  isEditing: boolean;
  onChange: (value: string) => void;
}

const ChargingMethodField: React.FC<ChargingMethodFieldProps> = ({
  value,
  isEditing,
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="chargingMethod">Charging Method</Label>
      {isEditing ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select charging method" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TravelChargingTypes).map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="text-sm text-grayCustom2">{value}</p>
      )}
    </div>
  );
};

export default ChargingMethodField;
