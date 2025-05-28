import React, { useState } from "react";
import { ItemSchema, CategorySchema, RoomSchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import ItemContainer from "./ItemContainer";
import SectionHeaderWithTag from "@/app/components/shared/heading/SectionHeaderWithTag";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";

interface SelectionInventoryProps {
  data: {
    items: ItemSchema[];
    categories: CategorySchema[];
    rooms: RoomSchema[];
  };
}

const SelectionInventory = ({ data }: SelectionInventoryProps) => {
  const [isCreateItemModal, setIsCreateItemModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomSchema | null>(null);

  const handleOpenCreateModal = () => {
    setIsCreateItemModal(true);
  };

  const handleClearSelectedRoom = () => {
    setSelectedRoom(null);
  };

  return (
    <div>
      {selectedRoom ? (
        <>
          <SectionHeaderWithTag
            tag={{
              label: selectedRoom.name,
              onRemove: handleClearSelectedRoom,
            }}
            action={<Button variant="outline">Add Item</Button>}
          />
          <ItemContainer items={data.items} categories={data.categories} />
        </>
      ) : (
        <>
          <SectionHeaderWithAction
            title="Rooms"
            action={<Button variant="outline">Add Item</Button>}
          />
          <SectionContainer>
            <SingleCardContainer>
              <SelectableCardContainer
                onClick={handleOpenCreateModal}
                centerText="ROOM"
                showPlusIcon
              />
              {data.rooms.map((room) => (
                <SelectableCardContainer
                  key={room._id}
                  id={room._id}
                  centerText={room.name}
                  onClick={() => setSelectedRoom(room)}
                />
              ))}
            </SingleCardContainer>
          </SectionContainer>
        </>
      )}
    </div>
  );
};

export default SelectionInventory;
