import FormActions from "@/app/components/shared/FormActions";
import MoveAddress from "../sections/MoveAddress";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import Header2 from "@/app/components/shared/heading/Header2";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import StopSection from "../sections/StopSection";
import LocationSummary from "../sections/LocationSummary";

interface LocationProps {
  onNext: () => void;
  onBack: () => void;
}

const Location = ({ onNext, onBack }: LocationProps) => {
  const { locations, isLocationSectionComplete } = useMoveForm();

  return (
    <FormContainer>
      <Header2 isCompleted={isLocationSectionComplete}>Location</Header2>

      <MoveAddress
        title="Starting Location"
        index={0}
        location={locations[0]}
      />
      <StopSection />
      <MoveAddress
        title="Ending Location"
        index={locations.length - 1}
        location={locations[locations.length - 1]}
      />
      <LocationSummary />

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

export default Location;
