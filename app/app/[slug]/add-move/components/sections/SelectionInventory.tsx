import React, { useState } from "react";
import { RoomSchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import SelectableCardContainer from "@/app/components/shared/containers/SelectableCardContainer";
import ItemContainer from "../ItemContainer";
import SectionHeaderWithTag from "@/app/components/shared/heading/SectionHeaderWithTag";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import Header3 from "@/app/components/shared/heading/Header3";
import AddRoomModal from "../modals/AddRoomModal";

interface SelectionInventoryProps {
  selectedItemIndices: Set<number>;
  setSelectedItemIndices: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const SelectionInventory = ({
  selectedItemIndices,
  setSelectedItemIndices,
}: SelectionInventoryProps) => {
  const [isCreateItemModal, setIsCreateItemModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const { roomOptions, itemOptions, updateMoveItem } = useMoveForm();
  const [addRoomModalOpen, setAddRoomModalOpen] = useState<boolean>(false);

  const handleOpenCreateModal = () => {
    setIsCreateItemModal(true);
  };

  const handleCreatedRoom = (name: string) => {
    setSelectedRoom(name);
  };

  const handleClearSelectedRoom = () => {
    setSelectedRoom(null);
  };

  const handleAssignRoom = (room: string) => {
    const indices = Array.from(selectedItemIndices);
    indices.forEach((index) => {
      updateMoveItem(index, { room });
    });
    setSelectedItemIndices(new Set());
  };

  return (
    <>
      {selectedItemIndices.size > 0 ? (
        <div>
          <Header3
            wrapperClassName="px-4 md:px-0 pt-4 md:pt-0"
            showCheckmark={false}
          >
            Assign Selected Items to Room
          </Header3>

          <SectionContainer showBorder={false}>
            <SingleCardContainer>
              {roomOptions?.map((room) => (
                <SelectableCardContainer
                  key={room._id}
                  id={room._id}
                  centerText={room.name}
                  onClick={() => handleAssignRoom(room.name)}
                />
              ))}
            </SingleCardContainer>
          </SectionContainer>
        </div>
      ) : selectedRoom ? (
        <div>
          <SectionHeaderWithTag
            tag={{
              label: selectedRoom,
              onRemove: handleClearSelectedRoom,
            }}
          />
          <ItemContainer roomName={selectedRoom} />
        </div>
      ) : (
        <div>
          <Header3
            wrapperClassName="px-4 md:px-0 pt-4 md:pt-0"
            showCheckmark={false}
          >
            Rooms
          </Header3>

          <SectionContainer showBorder={false}>
            <SingleCardContainer>
              <SelectableCardContainer
                onClick={() => setAddRoomModalOpen(true)}
                centerText="ROOM"
                showPlusIcon
              />
              {roomOptions?.map((room) => (
                <SelectableCardContainer
                  key={room._id}
                  id={room._id}
                  centerText={room.name}
                  onClick={() => setSelectedRoom(room.name)}
                />
              ))}
            </SingleCardContainer>
          </SectionContainer>
        </div>
      )}
      <AddRoomModal
        isOpen={addRoomModalOpen}
        onClose={() => setAddRoomModalOpen(false)}
        onCreatedRoom={handleCreatedRoom}
      />
    </>
  );
};

export default SelectionInventory;
