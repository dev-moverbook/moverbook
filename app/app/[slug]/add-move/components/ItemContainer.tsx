import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import React, { useState } from "react";
import TabSelector from "@/app/components/shared/TabSelector";
import PopularItems from "./PopularItems";
import CategoryInventory from "./CategoryInventory";
import SearchInventory from "./SearchInventory";
import { ItemSchema, CategorySchema } from "@/types/convex-schemas";

interface ItemContainerProps {
  items: ItemSchema[];
  categories: CategorySchema[];
}

const ItemContainer: React.FC<ItemContainerProps> = ({ items, categories }) => {
  const [activeTab, setActiveTab] = useState<string>("POPULAR");
  return (
    <SectionContainer>
      <CenteredContainer className="gap-4">
        <TabSelector
          tabs={["POPULAR", "CATEGORIES", "SEARCH"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {activeTab === "POPULAR" && <PopularItems items={items} />}
        {activeTab === "CATEGORIES" && (
          <CategoryInventory categories={categories} items={items} />
        )}
        {activeTab === "SEARCH" && <SearchInventory items={items} />}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ItemContainer;
