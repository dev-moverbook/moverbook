// SectionHeader.tsx
import { Pencil, Trash2, X, CircleCheckBig, AlertTriangle } from "lucide-react";
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
  showAlert?: boolean;
  canEdit?: boolean;
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
  showAlert,
  canEdit = true,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between pt-6 px-4 md:px-0 max-w-screen-sm ",
        className
      )}
    >
      {/* Left side: title + checkmark */}
      <div className="flex items-center gap-1.5">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showAlert && <AlertTriangle className="w-5 h-5 text-red-500" />}
        {showCheckmark && (
          <CircleCheckBig
            className={cn(
              "w-5 h-5",
              isCompleted ? "text-greenCustom" : "text-grayCustom2"
            )}
          />
        )}
      </div>

      {/* Right side: icons */}
      <div className="flex items-center gap-2">
        {actions ? (
          actions
        ) : isEditing && onCancelEdit && canEdit ? (
          <IconButton
            icon={<X size={16} />}
            aria-label="Cancel"
            onClick={onCancelEdit}
            className="border border-grayCustom"
          />
        ) : (
          <>
            {onEditClick && canEdit && (
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
          </>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
