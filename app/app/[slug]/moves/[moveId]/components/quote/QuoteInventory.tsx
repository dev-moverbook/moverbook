"use client";

import React from "react";
import { MoveSchema } from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { groupItemsByRoom } from "@/app/frontendUtils/helper";
import RoomCard from "../card/RoomCard";

interface QuoteInventoryProps {
  move: MoveSchema;
}

const QuoteInventory = ({ move }: QuoteInventoryProps) => {
  const { moveItems } = move;
  const grouped = groupItemsByRoom(moveItems);
  return (
    <div>
      <SectionHeader title="Inventory" />
      <SectionContainer>
        {Object.entries(grouped).map(([room, items]) => (
          <RoomCard key={room} room={room} items={items} />
        ))}
      </SectionContainer>
    </div>
  );
};

export default QuoteInventory;
