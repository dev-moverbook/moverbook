import Header2 from "@/app/components/shared/heading/Header2";
import InlineBanner from "@/app/components/shared/ui/InlineBanner";
import { Button } from "@/app/components/ui/button";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import MoveAddress from "./MoveAddress";
import Header3 from "@/app/components/shared/heading/Header3";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";

const StopSection = () => {
  const { locations, addStopLocation, isLocationSectionComplete } =
    useMoveForm();

  const [showBanner, setShowBanner] = useState<boolean>(false);

  const handleAddStop = (e: React.MouseEvent) => {
    e.preventDefault();
    addStopLocation();
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2000);
  };
  const stops = locations.slice(1, -1);

  return (
    <div>
      <SectionContainer>
        <Header3
          showCheckmark={false}
          className="pt-0"
          button={
            <div className="flex items-center gap-3">
              <InlineBanner
                message={`Stop #${locations.length - 2} added.`}
                show={showBanner}
                className="pt-0"
              />
              <Button
                onClick={handleAddStop}
                className=" flex items-center gap-1"
                size="sm"
                variant="outline"
              >
                <div className="flex items-center gap-1">
                  <Plus className="w-5 h-5" />{" "}
                  <span className="text-sm">Stop</span>
                </div>
              </Button>
            </div>
          }
          isCompleted={true}
        >
          Stops
        </Header3>
      </SectionContainer>
      {stops.map((stop, i) => (
        <MoveAddress
          key={i + 1}
          title={`Stop #${i + 1}`}
          index={i + 1}
          location={stop}
        />
      ))}
    </div>
  );
};

export default StopSection;
