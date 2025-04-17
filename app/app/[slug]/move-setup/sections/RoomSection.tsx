"use client";

import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { RoomSchema } from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import { Button } from "@/app/components/ui/button";
import RoomCard from "../cards/RoomCard";
import RoomModal from "../modals/RoomModal";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useUpdateRoom } from "../hooks/useUpdateRoom";
import { useDeleteRoom } from "../hooks/useDeleteRoom";
import SingleCardContainer from "@/app/components/shared/SingleCardContainer";
import ToggleTabs from "@/app/components/shared/ToggleTabs";
import SelectCard from "../cards/RoomCard";

interface RoomSectionProps {
  rooms: RoomSchema[];
  companyId: Id<"companies">;
}

type RoomManageMode = "edit" | "delete";

const RoomSection: React.FC<RoomSectionProps> = ({ rooms, companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [manageMode, setManageMode] = useState<RoomManageMode>("edit");

  const [selectedRoom, setSelectedRoom] = useState<RoomSchema | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [roomToDelete, setRoomToDelete] = useState<Id<"rooms"> | null>(null);

  const { createRoom, createRoomLoading, createRoomError, setCreateRoomError } =
    useCreateRoom();
  const { updateRoom, updateRoomLoading, updateRoomError, setUpdateRoomError } =
    useUpdateRoom();
  const { deleteRoom, deleteRoomLoading, deleteRoomError, setDeleteRoomError } =
    useDeleteRoom();

  const handleOpenCreateModal = (): void => {
    setIsEditMode(false);
    setSelectedRoom(null);
    setIsModalOpen(true);
    setCreateRoomError(null);
  };

  const handleOpenEditModal = (room: RoomSchema): void => {
    setIsEditMode(true);
    setSelectedRoom(room);
    setIsModalOpen(true);
    setUpdateRoomError(null);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleOpenDeleteModal = (roomId: Id<"rooms">): void => {
    setIsDeleteModalOpen(true);
    setRoomToDelete(roomId);
    setDeleteRoomError(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setRoomToDelete(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!roomToDelete) return;

    const success = await deleteRoom(roomToDelete);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Rooms"
          actions={
            <div className="flex items-center gap-4">
              {/* Left side: Edit & Add */}
              {!isEditMode ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                    Edit Rooms
                  </Button>
                  <Button onClick={handleOpenCreateModal}>+ Add Room</Button>
                </>
              ) : (
                <>
                  {/* Edit/Delete Toggle shown only in edit mode */}
                  <ToggleTabs<RoomManageMode>
                    value={manageMode}
                    onChange={(mode) => setManageMode(mode)}
                    options={[
                      { label: "Edit", value: "edit" },
                      { label: "Delete", value: "delete" },
                    ]}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      setManageMode("edit");
                    }}
                  >
                    Done
                  </Button>
                </>
              )}
            </div>
          }
        />

        <SingleCardContainer>
          {rooms.map((room) => (
            <SelectCard
              key={room._id}
              id={room._id}
              label={room.name}
              onEdit={() => handleOpenEditModal(room)}
              onDelete={handleOpenDeleteModal}
              showEditIcon={isEditMode}
              mode={manageMode}
            />
          ))}
        </SingleCardContainer>
        <RoomModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreate={createRoom}
          onEdit={updateRoom}
          loading={isEditMode ? updateRoomLoading : createRoomLoading}
          error={isEditMode ? updateRoomError : createRoomError}
          companyId={companyId}
          initialData={selectedRoom}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleteLoading={deleteRoomLoading}
          deleteError={deleteRoomError}
          title="Confirm Delete"
          description="Are you sure you want to delete this room? This action cannot be undone."
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default RoomSection;
