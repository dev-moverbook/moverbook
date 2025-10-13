"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { HourStatus } from "@/types/types";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface ApproveMoveAssignmentHoursInput {
  assignmentId: Id<"moveAssignments">;
  updates: {
    hourStatus: HourStatus;
    managerNotes?: string;
  };
}

export const useApproveMoveAssignmentHours = () => {
  const [approveAssignmentLoading, setApproveAssignmentLoading] =
    useState(false);
  const [approveAssignmentError, setApproveAssignmentError] = useState<
    string | null
  >(null);

  const approveMutation = useMutation(
    api.moveAssignments.approveMoveAssignmentHours
  );

  const approveMoveAssignmentHours = useCallback(
    async ({
      assignmentId,
      updates,
    }: ApproveMoveAssignmentHoursInput): Promise<boolean> => {
      setApproveAssignmentLoading(true);
      setApproveAssignmentError(null);
      try {
        await approveMutation({ assignmentId, updates });
        return true;
      } catch (error) {
        setErrorFromConvexError(error, (msg) => setApproveAssignmentError(msg));
        return false;
      } finally {
        setApproveAssignmentLoading(false);
      }
    },
    [approveMutation]
  );

  return {
    approveMoveAssignmentHours,
    approveAssignmentLoading,
    approveAssignmentError,
    setApproveAssignmentError,
  };
};
