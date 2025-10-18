"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { HourStatus } from "@/types/types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

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
  }: UpdateMoveAssignmentInput): Promise<boolean> => {
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
    updateMoveAssignment,
    assignmentUpdateLoading,
    assignmentUpdateError,
    setAssignmentUpdateError,
  };
};
