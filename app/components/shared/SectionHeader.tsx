import { Pencil } from "lucide-react";
import IconButton from "@/app/components/shared/IconButton";
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  isEditing?: boolean;
  onEditClick?: () => void;
  actions?: ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isEditing = false,
  onEditClick,
  actions,
}) => {
  return (
    <div className="flex items-center justify-between py-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {actions
        ? actions
        : !isEditing &&
          onEditClick && (
            <IconButton
              icon={<Pencil size={16} />}
              aria-label="Edit"
              onClick={onEditClick}
            />
          )}
    </div>
  );
};

export default SectionHeader;
