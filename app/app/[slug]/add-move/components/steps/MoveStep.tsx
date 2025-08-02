import FormActions from "@/app/components/shared/FormActions";
import MoveAddress from "../sections/MoveAddress";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import Header2 from "@/app/components/shared/heading/Header2";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import StopSection from "../sections/StopSection";
import LocationSummary from "../sections/LocationSummary";
import LabeledDateInput from "@/app/components/shared/labeled/LabeledDateInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import {
  SERVICE_TYPE_OPTIONS,
  ServiceType,
  START_WINDOW_OPTIONS,
  StartWindowOption,
} from "@/types/types";
import TimeSlotSelector from "@/app/components/shared/labeled/TimeSlotSelector";
import LabeledTimeInput from "@/app/components/shared/labeled/LabeledTimeInput";
import { useEffect, useState } from "react";
import { formatTime } from "@/app/frontendUtils/helper";
import MoveDetails from "../sections/MoveDetails";

interface MoveStepProps {
  onNext: () => void;
  onBack: () => void;
}

const MoveStep = ({ onNext, onBack }: MoveStepProps) => {
  const {
    updateLocation,
    removeLocation,
    isLocationSectionComplete,
    addStopLocation,
    companyContact,
    segmentDistances,
    arrivalWindowOptions,
    isLoading,
    isError,
    errorMessage,
    moveFormData,
    setMoveFormData,
    moveFormErrors,
    setMoveFormErrors,
  } = useMoveForm();
  const [startWindowOption, setStartWindowOption] =
    useState<StartWindowOption>("available");

  useEffect(() => {
    if (startWindowOption === "custom") {
      setMoveFormData({
        ...moveFormData,
        moveWindow: "custom",
      });
    }
  }, [startWindowOption]);

  return (
    <FormContainer>
      <MoveDetails />
      <MoveAddress
        title="Starting Location"
        index={0}
        location={moveFormData.locations[0]}
        updateLocation={updateLocation}
        isAdding={true}
      />
      <StopSection
        locations={moveFormData.locations}
        addStopLocation={addStopLocation}
        removeLocation={removeLocation}
        updateLocation={updateLocation}
      />
      <MoveAddress
        title="Ending Location"
        index={moveFormData.locations.length - 1}
        location={moveFormData.locations[moveFormData.locations.length - 1]}
        updateLocation={updateLocation}
        isAdding={true}
      />
      <LocationSummary
        companyContact={companyContact}
        locations={moveFormData.locations}
        segmentDistances={segmentDistances}
        roundTripMiles={moveFormData.roundTripMiles}
        roundTripDrive={moveFormData.roundTripDrive}
      />

      <FormActionContainer className="mt-6">
        <FormActions
          onSave={onNext}
          onCancel={onBack}
          isSaving={false}
          saveLabel="Next"
          cancelLabel="Back"
        />
      </FormActionContainer>
    </FormContainer>
  );
};

export default MoveStep;
