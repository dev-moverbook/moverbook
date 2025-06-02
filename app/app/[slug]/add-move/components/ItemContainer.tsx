import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import React, { useState } from "react";
import TabSelector from "@/app/components/shared/TabSelector";
import PopularItems from "./PopularItems";
import CategoryInventory from "./CategoryInventory";
import SearchInventory from "./SearchInventory";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { ItemSchema } from "@/types/convex-schemas";
import { MoveItemInput } from "@/types/form-types";

interface ItemContainerProps {
  roomName: string;
}

const ItemContainer: React.FC<ItemContainerProps> = ({ roomName }) => {
  const [activeTab, setActiveTab] = useState<string>("POPULAR");
  const {
    categoryOptions,
    itemOptions,
    addMoveItem,
    updateMoveItem,
    addedItems,
  } = useMoveForm();

  const handleAddItem = (item: ItemSchema) => {
    const existingIndex = addedItems.findIndex(
      (i) => i.item === item.name && i.room === roomName
    );

    if (existingIndex !== -1) {
      // Increment quantity
      const existingItem = addedItems[existingIndex];
      updateMoveItem(existingIndex, { quantity: existingItem.quantity + 1 });
    } else {
      // Add new item
      const moveItem: MoveItemInput = {
        item: item.name,
        room: roomName,
        quantity: 1,
        size: typeof item.size === "number" ? item.size : 0,
        weigth: item.weight,
      };
      addMoveItem(moveItem);
    }
  };
  return (
    <SectionContainer showBorder={false}>
      <TabSelector
        tabs={["POPULAR", "CATEGORIES", "SEARCH"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "POPULAR" && (
        <PopularItems items={itemOptions} handleAddMoveItem={handleAddItem} />
      )}
      {activeTab === "CATEGORIES" && (
        <CategoryInventory
          categories={categoryOptions}
          items={itemOptions}
          handleAddMoveItem={handleAddItem}
        />
      )}
      {activeTab === "SEARCH" && (
        <SearchInventory
          items={itemOptions}
          handleAddMoveItem={handleAddItem}
        />
      )}
    </SectionContainer>
  );
};

export default ItemContainer;
