import { Pencil, Trash2, X, CircleCheckBig } from "lucide-react";
import IconButton from "@/app/components/shared/IconButton";
import { ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  isEditing?: boolean;
  onEditClick?: () => void;
  onCancelEdit?: () => void;
  onDeleteClick?: (userId: Id<"users">) => void;
  actions?: ReactNode;
  id?: Id<"users">;
  className?: string;
  isCompleted?: boolean;
  showCheckmark?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isEditing = false,
  onEditClick,
  onCancelEdit,
  onDeleteClick,
  actions,
  id,
  className,
  isCompleted,
  showCheckmark,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between pt-6 px-4 md:px-0 max-w-screen-sm mx-auto",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showCheckmark && (
          <CircleCheckBig
            className={cn(
              "w-5 h-5",
              isCompleted ? "text-greenCustom" : "text-grayCustom2"
            )}
          />
        )}
      </div>

      {actions ? (
        actions
      ) : isEditing && onCancelEdit ? (
        <IconButton
          icon={<X size={16} />}
          aria-label="Cancel"
          onClick={onCancelEdit}
          variant="ghost"
        />
      ) : onEditClick || onDeleteClick ? (
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
