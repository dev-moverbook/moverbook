import { Button } from "../ui/button";

interface FormActionsProps {
  onSave: () => void;
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
}) => {
  return (
    <div className="flex flex-col  ">
      <p className="text-sm min-h-[1.25rem] text-red-500">{error || ""}</p>
      <div className="grid grid-cols-2 gap-2 mb-4 md:mb-0">
        <Button
          onClick={onCancel}
          variant={cancelVariant}
          className="w-full text-white"
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving}
          variant={saveVariant}
          className="w-full"
        >
          {isSaving ? "Saving..." : saveLabel}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
