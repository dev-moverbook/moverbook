import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface UpdateComplianceData {
  statePucPermitNumber?: string;
  dmvNumber?: string;
  usDotNumber?: string;
}

export const useUpdateCompliance = () => {
  const [updateComplianceLoading, setUpdateComplianceLoading] =
    useState<boolean>(false);
  const [updateComplianceError, setUpdateComplianceError] = useState<
    string | null
  >(null);

  const updateComplianceMutation = useMutation(api.compliance.updateCompliance);

  const updateCompliance = async (
    complianceId: Id<"compliance">,
    updates: UpdateComplianceData
  ): Promise<boolean> => {
    setUpdateComplianceLoading(true);
    setUpdateComplianceError(null);

    try {
      await updateComplianceMutation({
        complianceId,
        updates,
      });

      return true;
    } catch (error) {
      console.error(error);
      setUpdateComplianceError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUpdateComplianceLoading(false);
    }
  };

  return {
    updateCompliance,
    updateComplianceLoading,
    updateComplianceError,
    setUpdateComplianceError,
  };
};
