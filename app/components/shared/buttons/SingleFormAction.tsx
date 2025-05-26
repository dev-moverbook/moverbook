import { Button } from "../../ui/button";
import FormErrorMessage from "../error/FormErrorMessage";

interface SingleFormActionProps {
  isSubmitting?: boolean;
  submitLabel?: string;
  error?: string | null;
  submitVariant?: "default" | "destructive" | "outline" | "ghost";
  disabled?: boolean;
}

const SingleFormAction: React.FC<SingleFormActionProps> = ({
  isSubmitting = false,
  submitLabel = "Submit",
  error,
  submitVariant = "default",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col">
      <FormErrorMessage message={error} />
      <Button
        disabled={disabled}
        variant={submitVariant}
        className="w-full"
        isLoading={isSubmitting}
      >
        {submitLabel}
      </Button>
    </div>
  );
};

export default SingleFormAction;
