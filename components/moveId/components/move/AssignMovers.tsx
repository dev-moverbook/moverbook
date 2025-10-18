"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useInsertMoveAssignment } from "@/hooks/moveAssignments";
import { useUpdateMoveAssignment } from "@/hooks/moveAssignments";
import { useMoveContext } from "@/contexts/MoveContext";

const AssignMovers = ({
  assignments,
  allMovers,
}: {
  assignments: Doc<"moveAssignments">[];
  allMovers: Doc<"users">[];
}) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const moverNumber = move.movers;

  const { insertMoveAssignment } = useInsertMoveAssignment();
  const { updateMoveAssignment } = useUpdateMoveAssignment();

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
    assignment: Doc<"moveAssignments"> | null;
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

  const isComplete = assignments.length === moverNumber;

  return (
    <div>
      <SectionHeader
        className="mx-auto"
        title="Assigned Movers"
        showCheckmark={true}
        isCompleted={isComplete}
      />
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
