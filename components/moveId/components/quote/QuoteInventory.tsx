"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { groupItemsByRoom } from "@/frontendUtils/helper";
import RoomCard from "../card/RoomCard";
import EmptyList from "@/components/shared/message/EmptyList";
import { Doc } from "@/convex/_generated/dataModel";

interface QuoteInventoryProps {
  move: Doc<"moves">;
}

const QuoteInventory = ({ move }: QuoteInventoryProps) => {
  const { moveItems } = move;
  const grouped = groupItemsByRoom(moveItems ?? []);
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
