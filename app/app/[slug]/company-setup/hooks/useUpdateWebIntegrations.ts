import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface UpdateWebIntegrationsData {
  webform?: string;
  webformEmbeddedCode?: string;
  timeZone?: string;
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
      const response = await updateWebIntegrationsMutation({
        webIntegrationsId,
        updates,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateWebIntegrationsError(response.error);
      return false;
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
