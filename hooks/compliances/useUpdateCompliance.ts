import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

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

  const updateComplianceMutation = useMutation(
    api.compliances.updateCompliance
  );

  const updateCompliance = async (
    complianceId: Id<"compliances">,
    updates: UpdateComplianceData
  ): Promise<boolean> => {
    setUpdateComplianceLoading(true);
    setUpdateComplianceError(null);

    try {
      return await updateComplianceMutation({
        complianceId,
        updates,
      });
    } catch (error) {
      setErrorFromConvexError(error, setUpdateComplianceError);
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
