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
import MoverLocationMap from "../move/MoverLocationMap";
import { useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";

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

  const { sendPresetScript, sendPresetScriptLoading, sendPresetScriptError } =
    useSendPresetScript();

  const {
    stopMoverLocation,
    stopMoverLocationLoading,
    stopMoverLocationError,
    setStopMoverLocationError,
  } = useStopMoverLocation();

  const startSharing = async () => {
    setStopMoverLocationError(null);
    setIsSharing(true);
    await Promise.all([
      insertMoverLocation({ moveId }),
      sendPresetScript({
        moveId,
        preSetTypes: PresSetScripts.EMAIL_LOCATION_SHARING,
      }),
    ]);
  };

  const stopSharing = async () => {
    setInsertMoverLocationError(null);
    setIsSharing(false);
    await stopMoverLocation({ moveId });
  };

  const isCompleted = moverLocation !== null && !isSharing;
  const showMap = isSharing && moverLocation;

  const showShareButton = move.moveStatus !== "Completed";

  return (
    <div>
<Header3 
  isCompleted={isCompleted} 
  showCheckmark={false}
  button={
    showShareButton && (
      isSharing ? (
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
          variant="outline"
          className="w-full"
          isLoading={insertMoverLocationLoading || sendPresetScriptLoading}
        >
          Share
        </Button>
      )
    )
  } 
>
  Location Sharing
</Header3>
      
      <SectionContainer className="pb-0">
 
        {showMap ? <MoverLocationMap moverLocation={moverLocation} /> : <p >No location available.</p>}
        <FieldErrorMessage
          error={
            error ||
            insertMoverLocationError ||
            stopMoverLocationError ||
            sendPresetScriptError
          }
        />
      </SectionContainer>
    </div>
  );
};

export default LocationSharingSection;