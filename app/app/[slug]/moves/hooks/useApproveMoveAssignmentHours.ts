"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

type HourStatus = "pending" | "approved" | "rejected";

interface ApproveMoveAssignmentHoursInput {
  assignmentId: Id<"moveAssignments">;
  updates: {
    hourStatus: HourStatus;
    managerNotes?: string;
  };
}

export const useApproveMoveAssignmentHours = () => {
  const [approveAssignmentLoading, setApproveAssignmentLoading] =
    useState<boolean>(false);
  const [approveAssignmentError, setApproveAssignmentError] = useState<
    string | null
  >(null);

  const approveMutation = useMutation(
    api.moveAssignments.approveMoveAssignmentHours
  );

  const approveMoveAssignmentHours = async ({
    assignmentId,
    updates,
  }: ApproveMoveAssignmentHoursInput): Promise<{
    success: boolean;
    assignmentId?: Id<"moveAssignments">;
  }> => {
    setApproveAssignmentLoading(true);
    setApproveAssignmentError(null);

    try {
      const response = await approveMutation({ assignmentId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return { success: true, assignmentId: response.data.assignmentId };
      }

      setApproveAssignmentError(response.error);
      return { success: false };
    } catch (error) {
      setApproveAssignmentError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setApproveAssignmentLoading(false);
    }
  };

  return {
    approveMoveAssignmentHours,
    approveAssignmentLoading,
    approveAssignmentError,
    setApproveAssignmentError,
  };
};
