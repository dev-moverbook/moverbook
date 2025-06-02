import { FormEvent } from "react";
import { Button } from "../ui/button";
import FormErrorMessage from "./error/FormErrorMessage";

interface FormActionsProps {
  onSave: (e: React.FormEvent) => void | (() => void);
  onCancel: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  error?: string | null;
  saveVariant?: "default" | "destructive" | "outline" | "ghost";
  cancelVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "whiteGhost";
  disabled?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  isSaving = false,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  error,
  saveVariant = "default",
  cancelVariant = "ghost",
  disabled = false,
}) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={onCancel}
          variant={cancelVariant}
          className="w-full text-greenCustom "
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving || disabled}
          variant={saveVariant}
          className="w-full"
          isLoading={isSaving}
        >
          {saveLabel}
        </Button>
      </div>
      <FormErrorMessage message={error} />
    </div>
  );
};

export default FormActions;
