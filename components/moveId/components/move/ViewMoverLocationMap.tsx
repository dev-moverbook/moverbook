"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import MoverLocationMap from "./MoverLocationMap";
import { useMoveContext } from "@/contexts/MoveContext";

const ViewMoverLocationMap = () => {
  const { moveData } = useMoveContext();
  const moverLocation = moveData.moverLocation;

  const showMap = moverLocation?.isOn;

  const isComplete =
    !moverLocation?.isOn && moverLocation?.lat && moverLocation?.lng;

  return (
    <div>
      <Header3 isCompleted={Boolean(isComplete)}>Location Sharing</Header3>
      <SectionContainer>
        {showMap ? (
          <MoverLocationMap moverLocation={moverLocation} />
        ) : (
          <p className="text-grayCustom2">No Location Data Available.</p>
        )}
      </SectionContainer>
    </div>
  );
};

export default ViewMoverLocationMap;
