"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import { Button } from "@/components/ui/button";
import {
  useStopMoverLocation,
  useInsertMoverLocation,
  useUpdateMoverLocation,
} from "@/hooks/moverLocation";
import FieldErrorMessage from "@/components/shared/labeled/FieldErrorMessage";
import { useMoveContext } from "@/contexts/MoveContext";

interface LocationSharingSectionProps {
  isSharing: boolean;
  setIsSharing: (value: boolean) => void;
}

const LocationSharingSection = ({
  isSharing,
  setIsSharing,
}: LocationSharingSectionProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const moveId = move._id;
  const moverLocation = moveData.moverLocation;
  const { error } = useUpdateMoverLocation({
    moveId,
    enabled: isSharing,
  });

  const {
    insertMoverLocation,
    insertMoverLocationLoading,
    insertMoverLocationError,
    setInsertMoverLocationError,
  } = useInsertMoverLocation();

  const {
    stopMoverLocation,
    stopMoverLocationLoading,
    stopMoverLocationError,
    setStopMoverLocationError,
  } = useStopMoverLocation();

  const startSharing = async () => {
    setStopMoverLocationError(null);
    setIsSharing(true);
    await insertMoverLocation({ moveId });
  };

  const stopSharing = async () => {
    setInsertMoverLocationError(null);
    setIsSharing(false);
    await stopMoverLocation({ moveId });
  };
  const isCompleted = moverLocation !== null && !isSharing;

  return (
    <div>
      <Header3 isCompleted={isCompleted}>Location Sharing</Header3>
      <SectionContainer>
        {isSharing ? (
          <Button
            onClick={stopSharing}
            variant="destructive"
            className="w-full"
            disabled={Boolean(error)}
            isLoading={stopMoverLocationLoading}
          >
            Stop Sharing Location
          </Button>
        ) : (
          <Button
            onClick={startSharing}
            disabled={Boolean(error)}
            className="w-full"
            isLoading={insertMoverLocationLoading}
          >
            Start Sharing Location
          </Button>
        )}

        <FieldErrorMessage
          error={error || insertMoverLocationError || stopMoverLocationError}
        />
      </SectionContainer>
    </div>
  );
};

export default LocationSharingSection;
