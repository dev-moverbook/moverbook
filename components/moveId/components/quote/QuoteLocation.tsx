"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import CardContainer from "@/components/shared/card/CardContainer";
import QuoteLocationCard from "@/components/moveId/components/card/QuoteLocationCard";
import { Doc } from "@/convex/_generated/dataModel";

interface QuoteLocationProps {
  move: Doc<"moves">;
}

const QuoteLocation = ({ move }: QuoteLocationProps) => {
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
