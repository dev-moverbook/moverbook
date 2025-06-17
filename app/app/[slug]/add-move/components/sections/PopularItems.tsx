import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import { ItemSchema } from "@/types/convex-schemas";
import React, { useState } from "react";
import AddItemModal from "../modals/AddItemModal";
import { MoveItemInput } from "@/types/form-types";
interface PopularItemsProps {
  items?: ItemSchema[];
  handleAddMoveItem: (item: ItemSchema) => void;
  selectedRoom: string | null;
  addMoveItem: (item: MoveItemInput) => void;
}

const PopularItems: React.FC<PopularItemsProps> = ({
  items,
  handleAddMoveItem,
  selectedRoom,
  addMoveItem,
}) => {
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const popularItems = items?.filter((item) => item.isPopular);

  return (
    <SingleCardContainer>
      <SelectableCardContainer
        centerText="ITEM"
        showPlusIcon={true}
        onClick={() => setShowAddItemModal(true)}
      />
      {popularItems?.map((item) => (
        <SelectableCardContainer
          key={item._id}
          topLeftText="Popular"
          centerText={item.name}
          bottomCenterText={`${item.size}ft³`}
          onClick={() => handleAddMoveItem(item)}
        />
      ))}
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        selectedRoom={selectedRoom}
        addMoveItem={addMoveItem}
      />
    </SingleCardContainer>
  );
};

export default PopularItems;
