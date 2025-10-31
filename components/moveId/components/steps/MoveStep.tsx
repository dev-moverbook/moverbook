"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import { getMoveStatus } from "@/frontendUtils/tsxHelper";
import StepStatus from "../shared/StepStatus";
import ViewMoverSectionAsRep from "../move/ViewMoverSectionAsRep";

const MoveStep = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const moveStatus = getMoveStatus(move);

  return (
    <div>
      <StepStatus
        items={[
          {
            label: "Move Status",
            value: moveStatus.label,
            icon: moveStatus.icon,
          },
        ]}
      />

      <ViewMoverSectionAsRep />
    </div>
  );
};

export default MoveStep;
