import { Pencil, Trash2 } from "lucide-react";
import IconButton from "@/app/components/shared/IconButton";
import { ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface SectionHeaderProps {
  title: string;
  isEditing?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: (userId: Id<"users">) => void;
  actions?: ReactNode;
  id?: Id<any>;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isEditing = false,
  onEditClick,
  onDeleteClick,
  actions,
  id,
}) => {
  return (
    <div className="flex items-center justify-between py-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {actions ? (
        actions
      ) : !isEditing && (onEditClick || onDeleteClick) ? (
        <div className="flex gap-2">
          {onEditClick && (
            <IconButton
              icon={<Pencil size={16} />}
              aria-label="Edit"
              onClick={onEditClick}
            />
          )}
          {onDeleteClick && id && (
            <IconButton
              onClick={() => onDeleteClick(id)}
              icon={<Trash2 className="w-4 h-4" />}
              variant="outline"
              title="Delete"
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeader;
