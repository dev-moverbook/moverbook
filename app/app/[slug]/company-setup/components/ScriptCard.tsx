"use client";

import { Button } from "@/app/components/ui/button";
import { CommunicationType } from "@/types/enums";
import { ScriptSchema } from "@/types/convex-schemas";

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
  return (
    <div className="p-4 border rounded-md shadow-sm space-y-2">
      <div>
        <h3 className="text-lg font-semibold">{script.title}</h3>
        {script.type === CommunicationType.EMAIL && (
          <p className="text-sm text-gray-600">Subject: {script.emailTitle}</p>
        )}
        <p className="text-gray-700">{script.message}</p>
      </div>

      <div className="flex space-x-2">
        <Button onClick={() => onEdit(script)}>Edit</Button>
        {!script.preSetTypes && (
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScriptCard;
