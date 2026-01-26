import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { useAction } from "convex/react";
import { useState } from "react";

export const useEnsureMoveCustomerStripeProfiel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const action = useAction(api.actions.stripe.ensureMoveCustomerStripeProfile);

  const ensureMoveCustomerStripeProfile = async (
    moveId: Id<"moves">
  ): Promise<Doc<"moveCustomerStripeProfiles">> => {
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
    ensureMoveCustomerStripeProfile,
    loading,
    error,
    setError,
  };
};
