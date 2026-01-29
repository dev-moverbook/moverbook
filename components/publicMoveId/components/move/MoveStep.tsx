"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import MoverLocationMap from "@/components/moveId/components/move/MoverLocationMap";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import MoveTimes from "./MoveStartTime";

const MoveStep = () => {
  const { move } = usePublicMoveIdContext();
  const moverLocation = move.moverLocation;
  return (
    <SectionContainer className="px-0 pt-0">
      <MoveTimes />
      {moverLocation && <MoverLocationMap moverLocation={moverLocation} />}
    </SectionContainer>
  );
};

export default MoveStep;
