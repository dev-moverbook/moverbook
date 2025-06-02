import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import Header3 from "@/app/components/shared/heading/Header3";
import React, { useState } from "react";
import MoveAddress from "../MoveAddress";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { Button } from "@/app/components/ui/button";
import Header2 from "@/app/components/shared/heading/Header2";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import IconButton from "@/app/components/shared/IconButton";
import { Plus } from "lucide-react";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import { cn } from "@/lib/utils";
import InlineBanner from "@/app/components/shared/ui/InlineBanner";
interface LocationProps {
  onNext: () => void;
  onBack: () => void;
}

const Location = ({ onNext, onBack }: LocationProps) => {
  const { locations, addStopLocation } = useMoveForm();

  const [showBanner, setShowBanner] = useState<boolean>(false);

  const handleAddStop = (e: React.MouseEvent) => {
    e.preventDefault();
    addStopLocation();
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2000);
  };

  const isSectionComplete = locations.every((location) => {
    return (
      !!location.address &&
      !!location.squareFootage &&
      !!location.moveType &&
      !!location.moveSize &&
      !!location.accessType
    );
  });

  return (
    <FormContainer>
      <Header2
        button={
          <div className="flex items-center gap-3">
            <InlineBanner
              message={`Stop #${locations.length - 2} added.`}
              show={showBanner}
              className="pt-0"
            />
            <Button
              onClick={handleAddStop}
              className="bg-greenCustom text-white flex items-center gap-1"
              size="sm"
            >
              <div className="flex items-center gap-1">
                <Plus className="w-5 h-5" />{" "}
                <span className="text-sm">Stop</span>
              </div>
            </Button>
          </div>
        }
        isCompleted={isSectionComplete}
      >
        Location
      </Header2>

      {locations.map((location, i) => (
        <MoveAddress
          key={i}
          title={
            location.locationType === "starting"
              ? "Starting Location"
              : location.locationType === "ending"
                ? "Ending Location"
                : `Stop #${i - 1}`
          }
          index={i}
          location={location}
        />
      ))}
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
