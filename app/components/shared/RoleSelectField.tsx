import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ClerkRoles } from "@/types/enums";

interface RoleSelectFieldProps {
  value: ClerkRoles;
  isEditing: boolean;
  onChange: (value: ClerkRoles) => void;
  label?: string;
}

const RoleSelectField: React.FC<RoleSelectFieldProps> = ({
  value,
  isEditing,
  onChange,
  label = "Role",
}) => {
  const isAdmin = value === ClerkRoles.ADMIN;
  const displayRole = value;

  return (
    <div>
      <Label className="block font-medium mb-1">{label}</Label>

      {!isEditing || isAdmin ? (
        <p className=" text-grayCustom2">{displayRole}</p>
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ClerkRoles.MANAGER}>Manager</SelectItem>
            <SelectItem value={ClerkRoles.MOVER}>Mover</SelectItem>
            <SelectItem value={ClerkRoles.SALES_REP}>Sales Rep</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default RoleSelectField;
