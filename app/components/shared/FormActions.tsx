import { Button } from "../ui/button";

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  error?: string | null;
}

const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  isSaving = false,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  error,
}) => {
  return (
    <div className="flex flex-col space-y-2 pb-8">
      <p className="text-sm min-h-[1.25rem] text-red-500">{error || ""}</p>
      <div className="flex space-x-2">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : saveLabel}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
