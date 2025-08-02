import { Plus } from "lucide-react";
import { Button } from "../../ui/button";

interface AddItemButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({
  label,
  onClick,
  className = "",
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`flex flex-row  gap-1 ${className}`}
      type="button"
    >
      <div className="flex flex-row items-center gap-1">
        <Plus className="w-4 h-4" />
        <span>{label}</span>
      </div>
    </Button>
  );
};

export default AddItemButton;
