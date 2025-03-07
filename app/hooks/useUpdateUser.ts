import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { ClerkRoles } from "@/types/enums"; // adjust import path as needed

interface UpdateUserData {
  name?: string;
  hourlyRate?: number | null;
  role?: ClerkRoles;
}

export const useUpdateUser = () => {
  const updateUserAction = useAction(api.users.updateUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (
    id: Id<"users">,
    updatedData: UpdateUserData
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { name, hourlyRate, role } = updatedData;

      const result = await updateUserAction({
        userId: id,
        updates: { name, hourlyRate, role },
      });
      if (result.status === ResponseStatus.SUCCESS) {
        return true;
      } else {
        console.error(result.error);
        setError(FrontEndErrorMessages.GENERIC);
        return false;
      }
    } catch (err) {
      console.error(err);
      setError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};
