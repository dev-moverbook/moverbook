import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "../frontendUtils/errorHelper";

export const useDeleteUser = () => {
  const deleteUserMutation = useMutation(api.users.updateUserActiveStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: Id<"users">) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserMutation({ userId: id, isActive: false });
      return true;
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error, setError };
};
