import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Pencil, X, PlusCircle } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface SelectableCardContainerProps {
  topLeftText?: string;
  centerText?: string;
  bottomCenterText?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showEditIcon?: boolean;
  className?: string;
  id?: Id<"rooms"> | Id<"categories">;
  showPlusIcon?: boolean;
  showDeleteIcon?: boolean;
}

const SelectableCardContainer: React.FC<SelectableCardContainerProps> = ({
  topLeftText,
  centerText,
  bottomCenterText,
  onClick,
  onEdit,
  onDelete,
  showEditIcon = false,
  showDeleteIcon = false,
  className = "",
  id,
  showPlusIcon = false,
}) => {
  const handleIconClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (showDeleteIcon && onDelete) {
      onDelete();
    } else if (showEditIcon && onEdit) {
      onEdit();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (showEditIcon && onEdit) {
      onEdit();
    } else if (showDeleteIcon && onDelete) {
      onDelete();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      className={cn(
        "p-1 relative border border-grayCustom rounded shadow-lg shadow-white/10 transition w-[120px] h-[80px] flex items-center justify-center text-center focus:outline-none",
        onClick || showEditIcon || showDeleteIcon
          ? "hover:shadow-md cursor-pointer"
          : "cursor-default",
        className
      )}
    >
      <div className="relative w-full h-full flex items-center justify-center px-2">
        {topLeftText && (
          <span className="absolute top-1 left-1 text-xs text-grayCustom2">
            {topLeftText}
          </span>
        )}

        {centerText && (
          <>
            {showPlusIcon ? (
              <div className="flex flex-col items-center gap-1">
                <PlusCircle className="w-6 h-6 text-center" />
                <p className="text-sm text-center font-medium max-w-[90%] leading-tight">
                  {centerText}
                </p>
              </div>
            ) : (
              <p className="text-sm text-white font-medium text-center truncate max-w-[90%] leading-tight">
                {centerText}
              </p>
            )}
          </>
        )}

        {bottomCenterText && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-grayCustom2 text-xs text-center">
            {bottomCenterText}
          </span>
        )}

        {showEditIcon && onEdit && (
          <div className="absolute -top-3 -right-3 z-10">
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6 rounded-full shadow bg-greenCustom text-white"
              onClick={handleIconClick}
            >
              <Pencil className="w-3 h-3 text-white" />
            </Button>
          </div>
        )}

        {showDeleteIcon && onDelete && (
          <div className="absolute -top-3 -right-3 z-10">
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6 rounded-full shadow bg-red-500 text-white"
              onClick={handleIconClick}
            >
              <X className="w-3 h-3 text-white" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectableCardContainer;
