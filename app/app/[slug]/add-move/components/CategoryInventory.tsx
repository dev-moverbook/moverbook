import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import { ItemSchema } from "@/types/convex-schemas";
import { CategorySchema } from "@/types/convex-schemas";
import React, { useState } from "react";

interface CategoryInventoryProps {
  categories?: CategorySchema[];
  items?: ItemSchema[];
  handleAddMoveItem: (item: ItemSchema) => void;
}

const CategoryInventory: React.FC<CategoryInventoryProps> = ({
  categories,
  items,
  handleAddMoveItem,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySchema | null>(null);
  return (
    <SingleCardContainer>
      <SelectableCardContainer centerText="CATEGORY" showPlusIcon={true} />
      {categories?.map((category) => (
        <SelectableCardContainer
          key={category._id}
          id={category._id}
          centerText={category.name}
          onClick={() => setSelectedCategory(category)}
        />
      ))}
    </SingleCardContainer>
  );
};
export default CategoryInventory;
