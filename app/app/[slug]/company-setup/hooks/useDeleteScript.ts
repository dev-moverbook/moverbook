import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useDeleteScript = () => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteScriptMutation = useMutation(api.scripts.deleteScript);

  const deleteScript = async (scriptId: Id<"scripts">): Promise<boolean> => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const response = await deleteScriptMutation({ scriptId });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setDeleteError(FrontEndErrorMessages.GENERIC);
      return false;
    } catch (error) {
      console.error(error);
      setDeleteError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteScript, deleteLoading, deleteError, setDeleteError };
};
