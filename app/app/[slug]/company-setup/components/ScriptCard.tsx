"use client";

import { Pencil, Trash2, Mail, MessageSquare } from "lucide-react";
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
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {script.type === CommunicationType.EMAIL && <Mail size={16} />}
          {script.type === CommunicationType.SMS && <MessageSquare size={16} />}
          <h3 className="text-lg font-semibold">{script.title}</h3>
        </div>

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
              variant="outline"
              title="Delete"
            />
          )}
        </IconRow>
      </div>

      {script.type === CommunicationType.EMAIL && (
        <p className="text-sm mt-1 font-bold text-grayCustom">
          Subject: {script.emailTitle}
        </p>
      )}
      <p className="text-grayCustom">{script.message}</p>
    </div>
  );
};

export default ScriptCard;
