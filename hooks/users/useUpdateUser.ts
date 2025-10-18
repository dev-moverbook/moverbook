import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ClerkRoles } from "@/types/enums";
import { setErrorFromConvexError } from "../frontendUtils/errorHelper";

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

      return await updateUserAction({
        userId: id,
        updates: { name, hourlyRate, role },
      });
    } catch (err) {
      setErrorFromConvexError(err, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};
