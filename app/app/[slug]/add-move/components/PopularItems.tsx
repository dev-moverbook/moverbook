import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import { ItemSchema } from "@/types/convex-schemas";
import React from "react";

interface PopularItemsProps {
  items: ItemSchema[];
}

const PopularItems: React.FC<PopularItemsProps> = ({ items }) => {
  const popularItems = items.filter((item) => item.isPopular);

  return (
    <SingleCardContainer>
      <SelectableCardContainer centerText="ITEM" showPlusIcon={true} />
      {popularItems.map((item) => (
        <SelectableCardContainer
          key={item._id}
          topLeftText="Popular"
          centerText={item.name}
          bottomCenterText={`${item.size}ft³`}
        />
      ))}
    </SingleCardContainer>
  );
};

export default PopularItems;
