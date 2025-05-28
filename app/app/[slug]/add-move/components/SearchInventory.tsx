import React, { useState } from "react";
import { ItemSchema } from "@/types/convex-schemas";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import SearchInput from "@/app/components/shared/ui/SearchInput";

interface SearchInventoryProps {
  items: ItemSchema[];
}

const SearchInventory: React.FC<SearchInventoryProps> = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = items.filter((item) =>
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
        <SelectableCardContainer centerText="SEARCH" showPlusIcon={true} />
        {filteredItems.map((item) => (
          <SelectableCardContainer
            key={item._id}
            centerText={item.name}
            bottomCenterText={`${item.size}ft³`}
          />
        ))}
      </SingleCardContainer>
    </div>
  );
};

export default SearchInventory;
