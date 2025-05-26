import React, { useState } from "react";
import { ItemSchema } from "@/types/convex-schemas";
import SearchInput from "@/app/components/shared/ui/SearchInput";
import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import { Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";

interface SearchTabProps {
  items: ItemSchema[];
  isEditMode: boolean;
  handleEditItem: (item: ItemSchema) => void;
  handleOpenDeleteModal: (itemId: Id<"items">) => void;
  handleOpenItemModal: () => void;
  isDeleteMode: boolean;
}

const SearchTab: React.FC<SearchTabProps> = ({
  items,
  isEditMode,
  handleEditItem,
  handleOpenDeleteModal,
  handleOpenItemModal,
  isDeleteMode,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SectionContainer isLast={true}>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search items..."
        className=""
      />
      <SingleCardContainer>
        <SelectableCardContainer
          onClick={handleOpenItemModal}
          centerText="ITEM"
          showPlusIcon={true}
        />
        {filteredItems.map((item) => (
          <SelectableCardContainer
            key={item._id}
            topLeftText="Popular"
            centerText={item.name}
            bottomCenterText={`${item.size}ft³`}
            onEdit={isEditMode ? () => handleEditItem(item) : undefined}
            onDelete={
              isDeleteMode ? () => handleOpenDeleteModal(item._id) : undefined
            }
            showEditIcon={isEditMode}
            showDeleteIcon={isDeleteMode}
          />
        ))}
      </SingleCardContainer>
    </SectionContainer>
  );
};

export default SearchTab;
