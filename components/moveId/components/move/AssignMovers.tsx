"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import {
  useInsertMoveAssignment,
  useUpdateMoveAssignment,
} from "@/hooks/moveAssignments";
import { Doc, Id } from "@/convex/_generated/dataModel";
import AdaptiveContainer from "@/components/shared/select/AdaptiveContainer";
import AdaptiveSelect from "@/components/shared/select/AdaptiveSelect";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import { Label } from "@/components/ui/label";

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
        updates: { moverId, isLead },
      });
    } else {
      await insertMoveAssignment({ moveId: move._id, moverId, isLead });
    }
  };

  const slots = Array.from({ length: moverNumber ?? 0 }, (_, index) => {
    const isLead = index === 0;
    const label = isLead ? "Lead Mover" : `Mover #${index}`;
    const existingAssignment = assignments.find((assignment) =>
      isLead ? assignment.isLead : !assignment.isLead
    );
    return {
      slot: index,
      isLead,
      label,
      assignment: existingAssignment ?? null,
    };
  });

  const options = allMovers.map((mover) => ({
    label: mover.name,
    value: mover._id,
    image: mover.imageUrl,
  }));

  return (
    <SectionContainer>
      {slots.map(({ slot, label, assignment, isLead }) => (
        <AdaptiveContainer key={slot}>
          <Label>{label}</Label>
          <AdaptiveSelect
            title="Select mover"
            options={options}
            value={assignment?.moverId ?? ""}
            onChange={(value) =>
              handleChange({
                moverId: value as Id<"users">,
                isLead,
                assignment,
              })
            }
            placeholder="Select mover"
            triggerLabel="Movers"
            description={label}
            showAllOption={false}
            showSearch={true}
          />
        </AdaptiveContainer>
      ))}
    </SectionContainer>
  );
};

export default AssignMovers;
