"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import CardContainer from "@/components/shared/card/CardContainer";
import QuoteLocationCard from "@/components/moveId/components/card/QuoteLocationCard";
import { useMoveContext } from "@/contexts/MoveContext";

const QuoteLocation = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const location = move.locations;

  return (
    <div>
      <SectionHeader className="mx-auto" title="Location" />
      <SectionContainer>
        <CardContainer className="space-y-4">
          {location?.map((loc, index) => (
            <QuoteLocationCard
              key={loc.uid}
              location={loc}
              index={index}
              locationLength={location.length}
            />
          ))}
        </CardContainer>
      </SectionContainer>
    </div>
  );
};

export default QuoteLocation;
