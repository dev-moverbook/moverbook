"use client";

import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { RoomSchema } from "@/types/convex-schemas";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useUpdateRoom } from "../hooks/useUpdateRoom";
import { useDeleteRoom } from "../hooks/useDeleteRoom";
import RoomModal from "../modals/RoomModal";
import RoomCard from "../cards/RoomCard";

interface RoomSectionProps {
  rooms: RoomSchema[];
  companyId: Id<"companies">;
}

const RoomSection: React.FC<RoomSectionProps> = ({ rooms, companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Rooms</h2>

      {rooms.map((room) => (
        <div key={room._id} className="flex items-center justify-between">
          <RoomCard
            room={room}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        </div>
      ))}

      <button
        onClick={handleOpenCreateModal}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New Room
      </button>

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
    </div>
  );
};

export default RoomSection;
