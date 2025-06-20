"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import {
  MoveAssignmentSchema,
  MoveSchema,
  UserSchema,
} from "@/types/convex-schemas";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/convex/_generated/dataModel";
import { useInsertMoveAssignment } from "../../../hooks/useInsertMoveAssignment";
import { useUpdateMoveAssignment } from "../../../hooks/useUpdateMoveAssignment";

const AssignMovers = ({
  assignments,
  allMovers,
  move,
}: {
  assignments: MoveAssignmentSchema[];
  allMovers: UserSchema[];
  move: MoveSchema;
}) => {
  const moverNumber = move.movers;

  const { insertMoveAssignment, assignmentLoading } = useInsertMoveAssignment();
  const { updateMoveAssignment, assignmentUpdateLoading } =
    useUpdateMoveAssignment();

  // Build display slots
  const slots = Array.from({ length: moverNumber }, (_, i) => {
    const isLead = i === 0;
    const label = isLead ? "Lead Mover" : `Mover #${i}`;
    const existingAssignment = assignments.find((a) =>
      isLead ? a.isLead : !a.isLead
    );
    return {
      slot: i,
      isLead,
      label,
      assignment: existingAssignment ?? null,
    };
  });

  const handleChange = async ({
    moverId,
    isLead,
    assignment,
  }: {
    moverId: Id<"users">;
    isLead: boolean;
    assignment: MoveAssignmentSchema | null;
  }) => {
    if (assignment) {
      await updateMoveAssignment({
        assignmentId: assignment._id,
        updates: {
          moverId,
          isLead,
        },
      });
    } else {
      await insertMoveAssignment({
        moveId: move._id,
        moverId,
        isLead,
      });
    }
  };

  return (
    <div>
      <SectionHeader title="Movers" />
      <SectionContainer>
        <div className="flex flex-col gap-4">
          {slots.map(({ slot, label, assignment, isLead }) => (
            <div key={slot} className="flex flex-col gap-1">
              <Label>{label}</Label>
              <Select
                value={assignment?.moverId ?? ""}
                onValueChange={(newMoverId) => {
                  handleChange({
                    moverId: newMoverId as Id<"users">,
                    isLead,
                    assignment,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mover" />
                </SelectTrigger>
                <SelectContent>
                  {allMovers.map((mover) => (
                    <SelectItem key={mover._id} value={mover._id}>
                      {mover.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};

export default AssignMovers;
