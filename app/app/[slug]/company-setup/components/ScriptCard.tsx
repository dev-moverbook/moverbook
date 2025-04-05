"use client";

import { Pencil, Trash2 } from "lucide-react";
import { CommunicationType } from "@/types/enums";
import { ScriptSchema } from "@/types/convex-schemas";
import IconButton from "@/app/components/shared/IconButton";
import IconRow from "@/app/components/shared/IconRow";

interface ScriptCardProps {
  script: ScriptSchema;
  onDelete: () => void;
  onEdit: (script: ScriptSchema) => void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({
  script,
  onDelete,
  onEdit,
}) => {
  const onEditClick = () => onEdit(script);

  return (
    <div className="w-full   ">
      <div className="flex justify-between ">
        <h3 className="text-lg font-semibold">{script.title}</h3>

        <IconRow>
          <IconButton
            icon={<Pencil size={16} />}
            aria-label="Edit"
            onClick={onEditClick}
          />
          {!script.preSetTypes && (
            <IconButton
              icon={<Trash2 size={16} />}
              aria-label="Delete"
              onClick={onDelete}
            />
          )}
        </IconRow>
      </div>
      {script.type === CommunicationType.EMAIL && (
        <p className="text-sm mt-1 font-medium text-grayCustom">
          Subject: {script.emailTitle}
        </p>
      )}
      <p className="text-grayCustom">{script.message}</p>
    </div>
  );
};

export default ScriptCard;
