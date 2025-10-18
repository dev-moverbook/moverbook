import SectionContainer from "@/components/shared/containers/SectionContainer";
import React, { useState } from "react";
import TabSelector from "@/components/shared/tab/TabSelector";
import PopularItems from "./PopularItems";
import CategoryInventory from "./CategoryInventory";
import SearchInventory from "./SearchInventory";
import { MoveItemInput } from "@/types/form-types";
import { Doc } from "@/convex/_generated/dataModel";

interface ItemContainerProps {
  roomName: string;
  categoryOptions: Doc<"categories">[];
  itemOptions: Doc<"items">[];
  addMoveItem: (item: MoveItemInput) => void;
  updateMoveItem: (index: number, updates: Partial<MoveItemInput>) => void;
  moveItems: MoveItemInput[];
}

const ItemContainer: React.FC<ItemContainerProps> = ({
  roomName,
  categoryOptions,
  itemOptions,
  addMoveItem,
  updateMoveItem,
  moveItems,
}) => {
  const [activeTab, setActiveTab] = useState<string>("POPULAR");

  const handleAddItem = (item: Doc<"items">) => {
    const existingIndex = moveItems.findIndex(
      (i) => i.item === item.name && i.room === roomName
    );

    if (existingIndex !== -1) {
      // Increment quantity
      const existingItem = moveItems[existingIndex];
      updateMoveItem(existingIndex, { quantity: existingItem.quantity + 1 });
    } else {
      // Add new item
      const moveItem: MoveItemInput = {
        item: item.name,
        room: roomName,
        quantity: 1,
        size: typeof item.size === "number" ? item.size : 0,
        weight: item.weight ?? 0,
      };
      addMoveItem(moveItem);
    }
  };
  return (
    <SectionContainer showBorder={false} className="px-0">
      <TabSelector
        tabs={["POPULAR", "CATEGORIES", "SEARCH"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "POPULAR" && (
        <PopularItems
          items={itemOptions}
          handleAddMoveItem={handleAddItem}
          selectedRoom={roomName}
          addMoveItem={addMoveItem}
        />
      )}
      {activeTab === "CATEGORIES" && (
        <CategoryInventory categories={categoryOptions} />
      )}
      {activeTab === "SEARCH" && (
        <SearchInventory
          items={itemOptions}
          handleAddMoveItem={handleAddItem}
          selectedRoom={roomName}
          addMoveItem={addMoveItem}
        />
      )}
    </SectionContainer>
  );
};

export default ItemContainer;
