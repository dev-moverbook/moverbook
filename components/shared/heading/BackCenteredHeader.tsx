"use client";

import { ArrowLeft, Pencil, Trash, X } from "lucide-react";
import IconButton from "@/components/shared/buttons/IconButton";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type BackCenteredHeaderProps = {
  title: string;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  rightExtra?: React.ReactNode;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  className?: string;
  titleClassName?: string;
};

const BackCenteredHeader: React.FC<BackCenteredHeaderProps> = ({
  title,
  onEditClick,
  onDeleteClick,
  rightExtra,
  isEditing = false,
  onCancelEdit,
  className,
  titleClassName,
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-0 pt-2 w-full",
        className
      )}
    >
      <div className={cn("shrink-0 flex items-center justify-start w-20")}>
        <IconButton
          className="border-grayCustom"
          icon={<ArrowLeft size={16} />}
          aria-label="Back"
          onClick={handleBack}
        />
      </div>

      <h2
        className={cn(
          "flex-1 text-center text-2xl font-semibold leading-tight",
          titleClassName
        )}
      >
        {title}
      </h2>

      <div className={cn("shrink-0 flex items-center justify-end gap-2 w-20")}>
        {rightExtra}
        {isEditing && onCancelEdit ? (
          <IconButton
            className="border-grayCustom"
            icon={<X size={16} />}
            aria-label="Cancel editing"
            onClick={onCancelEdit}
          />
        ) : (
          <>
            {onEditClick && (
              <IconButton
                className="border-green-600"
                icon={<Pencil size={16} />}
                aria-label="Edit"
                onClick={onEditClick}
              />
            )}
            {onDeleteClick && (
              <IconButton
                className="border-grayCustom"
                icon={<Trash size={16} />}
                aria-label="Delete"
                onClick={onDeleteClick}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BackCenteredHeader;
