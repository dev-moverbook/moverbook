import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "../frontendUtils/errorHelper";

export const useReactivateUser = () => {
  const reactivateUserMutation = useMutation(api.users.updateUserActiveStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reactivateUser = async (id: Id<"users">) => {
    setLoading(true);
    setError(null);
    try {
      await reactivateUserMutation({
        userId: id,
        isActive: true,
      });
      return true;
    } catch (err) {
      setErrorFromConvexError(err, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reactivateUser, loading, error };
};
