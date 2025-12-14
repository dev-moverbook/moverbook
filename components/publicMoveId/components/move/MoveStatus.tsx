"use client";

import StepStatus from "@/components/moveId/components/shared/StepStatus";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { getMoveStatus } from "@/frontendUtils/tsxHelper";

const MoveStatus = () => {
  const { move } = usePublicMoveIdContext();
  const moveStatus = getMoveStatus(move.move);
  return (
    <StepStatus
      items={[
        {
          label: "Move Status",
          value: moveStatus.label,
          icon: moveStatus.icon,
        },
      ]}
    />
  );
};

export default MoveStatus;
