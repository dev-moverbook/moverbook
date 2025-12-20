"use client";

import IconButton from "@/components/shared/buttons/IconButton";
import SectionHeaderWithAction from "@/components/shared/section/SectionHeaderWithAction";
import { X } from "lucide-react";

interface MoveDetailsEditingHeadingProps {
  onCancel: () => void;
}

const MoveDetailsEditingHeading = ({
  onCancel,
}: MoveDetailsEditingHeadingProps) => {
  return (
    <SectionHeaderWithAction
      title="Move Details"
      action={
        <IconButton
          icon={<X className="w-4 h-4" />}
          onClick={onCancel}
          variant="outline"
          title="Cancel"
        />
      }
      className="pb-0 "
    />
  );
};

export default MoveDetailsEditingHeading;
