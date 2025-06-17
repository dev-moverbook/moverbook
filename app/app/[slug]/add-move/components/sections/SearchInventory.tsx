import React, { useState } from "react";
import { ItemSchema } from "@/types/convex-schemas";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import SearchInput from "@/app/components/shared/ui/SearchInput";
import AddItemModal from "../modals/AddItemModal";
import { MoveItemInput } from "@/types/form-types";

interface SearchInventoryProps {
  items?: ItemSchema[];
  handleAddMoveItem: (item: ItemSchema) => void;
  selectedRoom: string | null;
  addMoveItem: (item: MoveItemInput) => void;
}

const SearchInventory: React.FC<SearchInventoryProps> = ({
  items,
  handleAddMoveItem,
  selectedRoom,
  addMoveItem,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const filteredItems = items?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search items..."
        className=""
      />
      <SingleCardContainer>
        <SelectableCardContainer
          centerText="Item"
          showPlusIcon={true}
          onClick={() => setShowAddItemModal(true)}
        />
        {filteredItems?.map((item) => (
          <SelectableCardContainer
            key={item._id}
            centerText={item.name}
            bottomCenterText={`${item.size}ft³`}
            onClick={() => handleAddMoveItem(item)}
          />
        ))}
      </SingleCardContainer>
      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        selectedRoom={selectedRoom}
        addMoveItem={addMoveItem}
      />
    </div>
  );
};

export default SearchInventory;
