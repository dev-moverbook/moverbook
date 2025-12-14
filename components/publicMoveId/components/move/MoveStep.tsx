"use client";

import MoveStatus from "./MoveStatus";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import MoverLocationMap from "@/components/moveId/components/move/MoverLocationMap";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";

const MoveStep = () => {
  const { move } = usePublicMoveIdContext();
  const moverLocation = move.moverLocation;
  return (
    <SectionContainer showBorder={false} className="px-0">
      <MoveStatus />
      {moverLocation && <MoverLocationMap moverLocation={moverLocation} />}
    </SectionContainer>
  );
};

export default MoveStep;
