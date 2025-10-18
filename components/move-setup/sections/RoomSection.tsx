"use client";

import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import ConfirmModal from "@/components/shared/modal/ConfirmModal";
import RoomModal from "../modals/RoomModal";
import { useCreateRoom } from "@/hooks/rooms";
import { useUpdateRoom } from "@/hooks/rooms";
import { useDeleteRoom } from "@/hooks/rooms";
import SingleCardContainer from "@/components/shared/containers/SingleCardContainer";
import SelectableCardContainer from "@/components/shared/containers/SelectableCardContainer";
import IconButton from "@/components/shared/buttons/IconButton";
import { Pencil, Trash2, X } from "lucide-react";

interface RoomSectionProps {
  rooms: Doc<"rooms">[];
  companyId: Id<"companies">;
}

const RoomSection: React.FC<RoomSectionProps> = ({ rooms, companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  const [selectedRoom, setSelectedRoom] = useState<Doc<"rooms"> | null>(null);
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

  const handleOpenEditModal = (room: Doc<"rooms">): void => {
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
    setIsDeleteMode(false);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!roomToDelete) {
      return;
    }

    const success = await deleteRoom(roomToDelete);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          className="px-0 pb-4"
          title="Rooms"
          actions={
            <div className="flex gap-2">
              <IconButton
                onClick={() => setIsEditMode(!isEditMode)}
                icon={
                  isEditMode ? (
                    <X className="w-4 h-4 " />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )
                }
                title={isEditMode ? "Cancel Edit" : "Edit Rooms"}
                disabled={isDeleteMode}
              />
              <IconButton
                onClick={() => setIsDeleteMode(!isDeleteMode)}
                icon={
                  isDeleteMode ? (
                    <X className="w-4 h-4 " />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )
                }
                variant="outline"
                title={isDeleteMode ? "Cancel Delete" : "Delete Rooms"}
                disabled={isEditMode}
              />
            </div>
          }
        />

        <SingleCardContainer>
          <SelectableCardContainer
            onClick={handleOpenCreateModal}
            centerText="ROOM"
            showPlusIcon={true}
          />
          {rooms.map((room) => (
            <SelectableCardContainer
              key={room._id}
              id={room._id}
              centerText={room.name}
              onEdit={() => handleOpenEditModal(room)}
              onDelete={() => handleOpenDeleteModal(room._id)}
              showEditIcon={isEditMode}
              showDeleteIcon={isDeleteMode}
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
