"use client";

import React from "react";
import { MoveSchema } from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import CardContainer from "@/app/components/shared/CardContainer";
import QuoteLocationCard from "@/app/app/[slug]/moves/[moveId]/components/card/QuoteLocationCard";
import { Doc } from "@/convex/_generated/dataModel";

interface QuoteLocationProps {
  move: Doc<"move">;
}

const QuoteLocation = ({ move }: QuoteLocationProps) => {
  const location = move.locations;

  return (
    <div>
      <SectionHeader className="mx-auto" title="Location" />
      <SectionContainer>
        <CardContainer>
          {location.map((loc, index) => (
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
