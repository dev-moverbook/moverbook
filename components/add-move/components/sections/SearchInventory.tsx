import React, { useState } from "react";
import SingleCardContainer from "@/components/shared/containers/SingleCardContainer";
import SelectableCardContainer from "@/components/shared/containers/SelectableCardContainer";
import SearchInput from "@/components/shared/ui/SearchInput";
import AddItemModal from "../modals/AddItemModal";
import { MoveItemInput } from "@/types/form-types";
import { formatDisplayNumber } from "@/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";

interface SearchInventoryProps {
  items?: Doc<"items">[];
  handleAddMoveItem: (item: Doc<"items">) => void;
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
    <div className="flex flex-col gap-4 px-4 min-h-[80vh]">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search items..."
        className=""
      />
      <SingleCardContainer className="px-0">
        <SelectableCardContainer
          centerText="Item"
          showPlusIcon={true}
          onClick={() => setShowAddItemModal(true)}
        />
        {filteredItems?.map((item) => (
          <SelectableCardContainer
            key={item._id}
            centerText={item.name}
            bottomCenterText={formatDisplayNumber(item.size, "ft³")}
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
