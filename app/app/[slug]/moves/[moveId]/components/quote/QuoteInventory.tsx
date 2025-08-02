"use client";

import React from "react";
import { MoveSchema } from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { groupItemsByRoom } from "@/app/frontendUtils/helper";
import RoomCard from "../card/RoomCard";
import { Doc } from "@/convex/_generated/dataModel";
import EmptyList from "@/app/components/shared/message/EmptyList";

interface QuoteInventoryProps {
  move: Doc<"move">;
}

const QuoteInventory = ({ move }: QuoteInventoryProps) => {
  const { moveItems } = move;
  const grouped = groupItemsByRoom(moveItems);
  const noItems = Object.keys(grouped).length === 0;
  return (
    <div>
      <SectionHeader className="mx-auto" title="Inventory" />
      <SectionContainer>
        {noItems && <EmptyList message="No items added." />}
        {Object.entries(grouped).map(([room, items]) => (
          <RoomCard key={room} room={room} items={items} />
        ))}
      </SectionContainer>
    </div>
  );
};

export default QuoteInventory;
