import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { useAction } from "convex/react";
import { useState } from "react";

export const useStripeSetupIntent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const action = useAction(api.actions.stripe.createSetupIntent);

  const createSetupIntent = async (moveId: Id<"moves">) => {
    setLoading(true);
    setError(null);

    try {
      return await action({ moveId });
    } catch (err) {
      setErrorFromConvexError(err, setError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSetupIntent,
    loading,
    error,
    setError,
  };
};
