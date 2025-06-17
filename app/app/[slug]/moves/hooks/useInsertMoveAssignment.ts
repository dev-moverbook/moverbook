"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

interface InsertMoveAssignmentInput {
  moveId: Id<"move">;
  moverId: Id<"users">;
  isLead: boolean;
}

export const useInsertMoveAssignment = () => {
  const [assignmentLoading, setAssignmentLoading] = useState<boolean>(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  const insertMutation = useMutation(api.moveAssignments.insertMoveAssignment);

  const insertMoveAssignment = async ({
    moveId,
    moverId,
    isLead,
  }: InsertMoveAssignmentInput): Promise<{
    success: boolean;
    assignmentId?: Id<"moveAssignments">;
  }> => {
    setAssignmentLoading(true);
    setAssignmentError(null);

    try {
      const response = await insertMutation({ moveId, moverId, isLead });

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          assignmentId: response.data.assignmentId,
        };
      }

      console.error(response.error);
      setAssignmentError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setAssignmentError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setAssignmentLoading(false);
    }
  };

  return {
    insertMoveAssignment,
    assignmentLoading,
    assignmentError,
    setAssignmentError,
  };
};
