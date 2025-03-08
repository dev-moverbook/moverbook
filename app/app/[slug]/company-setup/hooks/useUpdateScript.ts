import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CommunicationType, ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface UpdateScriptData {
  title?: string;
  type?: CommunicationType;
  message?: string;
  emailTitle?: string;
}

export const useUpdateScript = () => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateScriptMutation = useMutation(api.scripts.updateScript);

  const updateScript = async (
    scriptId: Id<"scripts">,
    updates: UpdateScriptData
  ): Promise<boolean> => {
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const response = await updateScriptMutation({ scriptId, updates });

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

  return { updateScript, updateLoading, updateError, setUpdateError };
};
