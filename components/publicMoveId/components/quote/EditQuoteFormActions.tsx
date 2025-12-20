"use client";

import FormActions from "@/components/shared/buttons/FormActions";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { useCreateMoveChangeRequest } from "@/hooks/moveChangeRequest";
import { LocationInput, MoveItemInput } from "@/types/form-types";
import { isEqual } from "lodash";

interface EditQuoteFormActionsProps {
  onCancel: () => void;
  requestedLocations?: LocationInput[];
  requestedMoveItems?: MoveItemInput[];
}

const EditQuoteFormActions = ({
  onCancel,
  requestedLocations,
  requestedMoveItems,
}: EditQuoteFormActionsProps) => {
  const { move } = usePublicMoveIdContext();
  const { move: moveData } = move;

  const { requestMoveUpdate, isLoading, error } = useCreateMoveChangeRequest();

  const currentLocations = moveData.locations ?? [];
  const currentMoveItems = moveData.moveItems ?? [];

  const newLocations = requestedLocations ?? currentLocations;
  const newMoveItems = requestedMoveItems ?? currentMoveItems;

  const hasChanges =
    !isEqual(currentLocations, newLocations) ||
    !isEqual(currentMoveItems, newMoveItems);

  const handleSave = async () => {
    if (!hasChanges) {
      onCancel();
      return;
    }

    const success = await requestMoveUpdate({
      moveId: moveData._id,
      requestedLocations: newLocations,
      requestedMoveItems: newMoveItems,
    });

    if (success) {
      onCancel();
    }
  };

  const isDisabled = isLoading || !hasChanges;

  return (
    <FormActions
      onSave={(e) => {
        e.preventDefault();
        handleSave();
      }}
      onCancel={onCancel}
      isSaving={isLoading}
      error={error}
      disabled={isDisabled}
    />
  );
};

export default EditQuoteFormActions;
