import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CommunicationType } from "@/types/types";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface UpdateScriptData {
  title?: string;
  type?: CommunicationType;
  message?: string;
  emailTitle?: string;
}

export const useUpdateScript = () => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateScriptMutation = useMutation(api.scripts.updateScript);

  const updateScript = async (
    scriptId: Id<"scripts">,
    updates: UpdateScriptData
  ): Promise<boolean> => {
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      return await updateScriptMutation({ scriptId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setUpdateError);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateScript, updateLoading, updateError, setUpdateError };
};
