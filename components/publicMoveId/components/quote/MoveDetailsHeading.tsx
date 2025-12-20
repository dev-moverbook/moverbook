"use client";

import IconButton from "@/components/shared/buttons/IconButton";
import SectionHeaderWithAction from "@/components/shared/section/SectionHeaderWithAction";
import { Pencil } from "lucide-react";

interface MoveDetailsHeadingProps {
  onEditClick?: () => void;
}

const MoveDetailsHeading = ({ onEditClick }: MoveDetailsHeadingProps) => {
  return (
    <SectionHeaderWithAction
      title="Move Details"
      action={
        onEditClick && (
          <IconButton
            icon={<Pencil className="w-4 h-4" />}
            onClick={onEditClick}
            variant="outline"
            title="Edit"
          />
        )
      }
      className="pb-0"
    />
  );
};

export default MoveDetailsHeading;
