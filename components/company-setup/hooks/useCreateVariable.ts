import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

//not used
export const useCreateVariable = () => {
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createVariableMutation = useMutation(api.variables.createVariable);

  const createVariable = async (
    companyId: Id<"companies">,
    name: string,
    defaultValue: string
  ): Promise<boolean> => {
    setCreateLoading(true);
    setCreateError(null);

    try {
      const response = await createVariableMutation({
        companyId,
        name,
        defaultValue,
      });

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

  return { createVariable, createLoading, createError, setCreateError };
};
