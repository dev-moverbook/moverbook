import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface UpdateWebIntegrationsData {
  externalReviewUrl?: string;
}

export const useUpdateWebIntegrations = () => {
  const [updateWebIntegrationsLoading, setUpdateWebIntegrationsLoading] =
    useState<boolean>(false);
  const [updateWebIntegrationsError, setUpdateWebIntegrationsError] = useState<
    string | null
  >(null);

  const updateWebIntegrationsMutation = useMutation(
    api.webIntegrations.updateWebIntegrations
  );

  const updateWebIntegrations = async (
    webIntegrationsId: Id<"webIntegrations">,
    updates: UpdateWebIntegrationsData
  ): Promise<boolean> => {
    setUpdateWebIntegrationsLoading(true);
    setUpdateWebIntegrationsError(null);

    try {
      return await updateWebIntegrationsMutation({
        webIntegrationsId,
        updates,
      });
    } catch (error) {
      console.error(error);
      setUpdateWebIntegrationsError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUpdateWebIntegrationsLoading(false);
    }
  };

  return {
    updateWebIntegrations,
    updateWebIntegrationsLoading,
    updateWebIntegrationsError,
    setUpdateWebIntegrationsError,
  };
};
