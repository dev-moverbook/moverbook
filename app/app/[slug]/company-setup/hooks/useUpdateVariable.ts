import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useUpdateVariable = () => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateVariableMutation = useMutation(api.variables.updateVariable);

  const updateVariable = async (
    variableId: Id<"variables">,
    updates: { name?: string; defaultValue?: string; isActive?: boolean }
  ): Promise<boolean> => {
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const response = await updateVariableMutation({ variableId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateError(response.error);
      return false;
    } catch (error) {
      console.error(error);
      setUpdateError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateVariable, updateLoading, updateError, setUpdateError };
};
