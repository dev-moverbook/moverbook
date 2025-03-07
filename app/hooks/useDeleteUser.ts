import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

export const useDeleteUser = () => {
  const deleteUserMutation = useMutation(api.users.updateUserActiveStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: Id<"users">) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteUserMutation({ userId: id, isActive: false });
      if (result.status === ResponseStatus.SUCCESS) {
        return true;
      } else {
        console.error(result.error);
        setError(FrontEndErrorMessages.GENERIC);
      }
    } catch (errr) {
      console.error(error);
      setError(FrontEndErrorMessages.GENERIC);
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error, setError };
};
