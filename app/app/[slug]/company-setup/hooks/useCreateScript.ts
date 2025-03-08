import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CommunicationType, ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface CreateScriptData {
  companyId: Id<"companies">;
  title: string;
  type: CommunicationType;
  message: string;
  emailTitle?: string;
}

export const useCreateScript = () => {
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createScriptMutation = useMutation(api.scripts.createScript);

  const createScript = async (data: CreateScriptData): Promise<boolean> => {
    setCreateLoading(true);
    setCreateError(null);

    try {
      if (
        data.type === CommunicationType.EMAIL &&
        (!data.emailTitle || data.emailTitle.trim() === "")
      ) {
        setCreateError(FrontEndErrorMessages.EMAIL_TITLE_REQUIRED);
        return false;
      }

      const response = await createScriptMutation(data);

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setCreateError(response.error);
      return false;
    } catch (error) {
      console.error(error);
      setCreateError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  return { createScript, createLoading, createError, setCreateError };
};
