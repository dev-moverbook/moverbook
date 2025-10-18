import React, { useEffect, useState } from "react";
import SingleCardContainer from "@/components/shared/containers/SingleCardContainer";
import SelectableCardContainer from "@/components/shared/containers/SelectableCardContainer";
import ItemContainer from "./ItemContainer";
import SectionHeaderWithTag from "@/components/shared/heading/SectionHeaderWithTag";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import AddRoomModal from "../modals/AddRoomModal";
import IconButton from "@/components/shared/buttons/IconButton";
import { Trash2, X } from "lucide-react";
import CounterInput from "@/components/shared/labeled/CounterInput";
import Header4 from "@/components/shared/heading/Header4";
import IconRow from "@/components/shared/buttons/IconRow";
import ConfirmModal from "@/components/shared/modal/ConfirmModal";
import { MoveItemInput } from "@/types/form-types";
import { Doc } from "@/convex/_generated/dataModel";

interface SelectionInventoryProps {
  selectedItemIndices: Set<number>;
  setSelectedItemIndices: React.Dispatch<React.SetStateAction<Set<number>>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  roomOptions?: Doc<"rooms">[];
  itemOptions?: Doc<"items">[];
  updateMoveItem: (index: number, updates: Partial<MoveItemInput>) => void;
  removeMoveItem: (index: number) => void;
  addMoveItem: (item: MoveItemInput) => void;
  moveItems: MoveItemInput[];
  categoryOptions?: Doc<"categories">[];
}

const SelectionInventory = ({
  selectedItemIndices,
  setSelectedItemIndices,
  selectedRoom,
  setSelectedRoom,
  roomOptions,
  itemOptions,
  updateMoveItem,
  removeMoveItem,
  addMoveItem,
  moveItems,
  categoryOptions,
}: SelectionInventoryProps) => {
  const [addRoomModalOpen, setAddRoomModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<null | number>(null);

  useEffect(() => {
    if (selectedItemIndices.size === 0) {
      setQuantity(null);
    }
    if (selectedItemIndices.size === 1) {
      const selectedIndex = Array.from(selectedItemIndices)[0];
      const selectedItem = moveItems[selectedIndex];
      if (selectedItem) {
        setQuantity(selectedItem.quantity);
      }
    }
  }, [selectedItemIndices, moveItems]);

  const handleDeleteSelected = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    const indices = Array.from(selectedItemIndices);
    indices.forEach((index) => removeMoveItem(index));
    setSelectedItemIndices(new Set());
    setDeleteModalOpen(false);
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

  const handleClearSelectedItems = () => {
    setSelectedItemIndices(new Set());
    setQuantity(null);
  };

  const handleEditSubmit = (val: number) => {
    if (val >= 1) setQuantity(val);

    const indices = Array.from(selectedItemIndices);
    indices.forEach((index) => updateMoveItem(index, { quantity: val }));
  };

  return (
    <>
      {selectedItemIndices.size > 0 ? (
        <div>
          <SectionContainer>
            <Header3
              wrapperClassName="px-0 pt-0"
              showCheckmark={false}
              button={
                <IconRow>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClearSelectedItems();
                    }}
                    icon={<X className="w-4 h-4" />}
                    variant="outline"
                    title="Clear selection"
                  />
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteSelected();
                    }}
                    icon={<Trash2 className="w-4 h-4" />}
                    variant="outline"
                    title="Delete"
                  />
                </IconRow>
              }
            >
              {selectedItemIndices.size === 1
                ? "Update Selected Item"
                : "Delete Selected Items"}
            </Header3>

            {selectedItemIndices.size === 1 && (
              <CounterInput
                label="Quantity"
                value={quantity}
                onChange={(val) => {
                  if (val !== null) handleEditSubmit(val);
                }}
                min={1}
              />
            )}
          </SectionContainer>
          <SectionContainer showBorder={false}>
            <Header4>Update Room Assignment</Header4>
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
          <ItemContainer
            roomName={selectedRoom}
            categoryOptions={categoryOptions || []}
            itemOptions={itemOptions || []}
            addMoveItem={addMoveItem}
            updateMoveItem={updateMoveItem}
            moveItems={moveItems}
          />
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
      <ConfirmModal
        title="Are you sure you want to delete these items?"
        description="This action cannot be undone."
        onClose={() => setDeleteModalOpen(false)}
        isOpen={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        deleteLoading={false}
        deleteError={null}
      />
    </>
  );
};

export default SelectionInventory;
