"use client";

import { Pencil, Trash2, Mail, MessageSquare } from "lucide-react";
import IconButton from "@/components/shared/buttons/IconButton";
import IconRow from "@/components/shared/buttons/IconRow";
import { Doc } from "@/convex/_generated/dataModel";

interface ScriptCardProps {
  script: Doc<"scripts">;
  onDelete: () => void;
  onEdit: (script: Doc<"scripts">) => void;
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
          {script.type === "email" && <Mail size={16} />}
          {script.type === "sms" && <MessageSquare size={16} />}
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

      {script.type === "email" && (
        <p className="text-sm font-bold text-grayCustom">
          Subject: {script.emailTitle}
        </p>
      )}
      <p className="text-grayCustom">{script.message}</p>
    </div>
  );
};

export default ScriptCard;
