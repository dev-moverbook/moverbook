"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { HourStatus } from "@/types/types";

interface UpdateMoveAssignmentInput {
  assignmentId: Id<"moveAssignments">;
  updates: {
    isLead?: boolean;
    startTime?: number;
    endTime?: number;
    breakAmount?: number;
    hourStatus?: HourStatus;
    managerNotes?: string;
    moverId?: Id<"users">;
  };
}

export const useUpdateMoveAssignment = () => {
  const [assignmentUpdateLoading, setAssignmentUpdateLoading] =
    useState<boolean>(false);
  const [assignmentUpdateError, setAssignmentUpdateError] = useState<
    string | null
  >(null);

  const updateMutation = useMutation(api.moveAssignments.updateMoveAssignment);

  const updateMoveAssignment = async ({
    assignmentId,
    updates,
  }: UpdateMoveAssignmentInput): Promise<{
    success: boolean;
    assignmentId?: Id<"moveAssignments">;
  }> => {
    setAssignmentUpdateLoading(true);
    setAssignmentUpdateError(null);

    try {
      const response = await updateMutation({ assignmentId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          assignmentId: response.data.assignmentId,
        };
      }

      console.error(response.error);
      setAssignmentUpdateError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setAssignmentUpdateError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setAssignmentUpdateLoading(false);
    }
  };

  return {
    updateMoveAssignment,
    assignmentUpdateLoading,
    assignmentUpdateError,
    setAssignmentUpdateError,
  };
};
