import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CommunicationType } from "@/types/types";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface CreateScriptData {
  companyId: Id<"companies">;
  title: string;
  type: CommunicationType;
  message: string;
  emailTitle?: string;
}

export const useCreateScript = () => {
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createScriptMutation = useMutation(api.scripts.createScript);

  const createScript = async (data: CreateScriptData): Promise<boolean> => {
    setCreateLoading(true);
    setCreateError(null);

    try {
      if (
        data.type === "email" &&
        (!data.emailTitle || data.emailTitle.trim() === "")
      ) {
        setCreateError(FrontEndErrorMessages.EMAIL_TITLE_REQUIRED);
        return false;
      }

      await createScriptMutation(data);

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setCreateError);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  return { createScript, createLoading, createError, setCreateError };
};
