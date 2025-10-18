import { Button } from "../ui/button";
import FormErrorMessage from "./error/FormErrorMessage";

interface FormActionsProps {
  onSave: (e: React.FormEvent) => void | (() => void);
  onCancel: () => void;
  isSaving?: boolean;
  isCanceling?: boolean;
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
  cancelDisabled?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  isSaving = false,
  isCanceling = false,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  error,
  saveVariant = "default",
  cancelVariant = "ghost",
  disabled = false,
  cancelDisabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={onCancel}
          disabled={cancelDisabled || isCanceling}
          isLoading={isCanceling}
          variant={cancelVariant}
          className="w-full "
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onSave}
          disabled={disabled || isSaving}
          isLoading={isSaving}
          variant={saveVariant}
          className="w-full"
        >
          {saveLabel}
        </Button>
      </div>
      <FormErrorMessage className="text-center" message={error} />
    </div>
  );
};

export default FormActions;
