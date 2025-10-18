import SelectableCardContainer from "@/components/shared/containers/SelectableCardContainer";
import SingleCardContainer from "@/components/shared/SingleCardContainer";
import React, { useState } from "react";
import AddItemModal from "../modals/AddItemModal";
import { MoveItemInput } from "@/types/form-types";
import { Doc } from "@/convex/_generated/dataModel";
interface PopularItemsProps {
  items?: Doc<"items">[];
  handleAddMoveItem: (item: Doc<"items">) => void;
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
    <SingleCardContainer className="px-4">
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
