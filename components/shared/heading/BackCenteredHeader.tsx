"use client";

import clsx from "clsx";
import { ArrowLeft, Pencil, Trash, X } from "lucide-react";
import IconButton from "@/components/shared/buttons/IconButton";

type BackCenteredHeaderProps = {
  title: string;
  onBack: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  rightExtra?: React.ReactNode;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  className?: string;
  titleClassName?: string;
};

const fixedSideWidth = "w-20";

const BackCenteredHeader: React.FC<BackCenteredHeaderProps> = ({
  title,
  onBack,
  onEditClick,
  onDeleteClick,
  rightExtra,
  isEditing = false,
  onCancelEdit,
  className,
  titleClassName,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-between px-0 pt-2 w-full",
        className
      )}
    >
      <div
        className={clsx(
          "shrink-0 flex items-center justify-start",
          fixedSideWidth
        )}
      >
        <IconButton
          className="border-grayCustom"
          icon={<ArrowLeft size={16} />}
          aria-label="Back"
          onClick={onBack}
        />
      </div>

      <h2
        className={clsx(
          "flex-1 text-center text-2xl font-semibold leading-tight",
          titleClassName
        )}
      >
        {title}
      </h2>

      <div
        className={clsx(
          "shrink-0 flex items-center justify-end gap-2",
          fixedSideWidth
        )}
      >
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
