import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useDeleteScript = () => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteScriptMutation = useMutation(api.scripts.deleteScript);

  const deleteScript = async (scriptId: Id<"scripts">): Promise<boolean> => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteScriptMutation({ scriptId });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setDeleteError);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteScript, deleteLoading, deleteError, setDeleteError };
};
