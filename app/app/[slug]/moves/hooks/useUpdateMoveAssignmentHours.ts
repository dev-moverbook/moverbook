"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

interface UpdateMoveAssignmentHoursInput {
  assignmentId: Id<"moveAssignments">;
  updates: {
    startTime?: number;
    endTime?: number;
    breakAmount?: number;
  };
}

export const useUpdateMoveAssignmentHours = () => {
  const [assignmentUpdateLoading, setAssignmentUpdateLoading] =
    useState<boolean>(false);
  const [assignmentUpdateError, setAssignmentUpdateError] = useState<
    string | null
  >(null);

  const updateMutation = useMutation(
    api.moveAssignments.updateMoveAssignmentHours
  );

  const updateMoveAssignmentHours = async ({
    assignmentId,
    updates,
  }: UpdateMoveAssignmentHoursInput): Promise<{
    success: boolean;
  }> => {
    setAssignmentUpdateLoading(true);
    setAssignmentUpdateError(null);

    try {
      const response = await updateMutation({ assignmentId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
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
    updateMoveAssignmentHours,
    assignmentUpdateLoading,
    assignmentUpdateError,
    setAssignmentUpdateError,
  };
};
