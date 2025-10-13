"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
  }: InsertMoveAssignmentInput): Promise<boolean> => {
    setAssignmentLoading(true);
    setAssignmentError(null);

    try {
      await insertMutation({ moveId, moverId, isLead });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setAssignmentError);
      return false;
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
