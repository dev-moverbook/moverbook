import React, { useState } from "react";
import SearchInput from "@/components/shared/ui/SearchInput";
import SelectableCardContainer from "@/components/shared/containers/SelectableCardContainer";
import SingleCardContainer from "@/components/shared/SingleCardContainer";
import { Doc, Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/components/shared/SectionContainer";

interface SearchTabProps {
  items: Doc<"items">[];
  isEditMode: boolean;
  handleEditItem: (item: Doc<"items">) => void;
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
