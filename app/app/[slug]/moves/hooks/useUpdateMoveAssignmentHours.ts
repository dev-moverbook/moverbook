"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
  }: UpdateMoveAssignmentHoursInput): Promise<boolean> => {
    setAssignmentUpdateLoading(true);
    setAssignmentUpdateError(null);

    try {
      return await updateMutation({ assignmentId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setAssignmentUpdateError);
      return false;
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
