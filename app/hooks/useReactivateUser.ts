import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

export const useReactivateUser = () => {
  const reactivateUserMutation = useMutation(api.users.updateUserActiveStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reactivateUser = async (id: Id<"users">) => {
    setLoading(true);
    setError(null);
    try {
      const result = await reactivateUserMutation({
        userId: id,
        isActive: true,
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

  return { reactivateUser, loading, error };
};
