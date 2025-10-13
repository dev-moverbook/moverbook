import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
      await updateVariableMutation({ variableId, updates });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setUpdateError);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateVariable, updateLoading, updateError, setUpdateError };
};
