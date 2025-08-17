"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import CardContainer from "@/app/components/shared/CardContainer";
import QuoteLocationCard from "@/app/app/[slug]/moves/[moveId]/components/card/QuoteLocationCard";
import { useMoveContext } from "@/app/contexts/MoveContext";

const QuoteLocation = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const location = move.locations;

  return (
    <div>
      <SectionHeader className="mx-auto" title="Location" />
      <SectionContainer>
        <CardContainer className="space-y-4">
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
