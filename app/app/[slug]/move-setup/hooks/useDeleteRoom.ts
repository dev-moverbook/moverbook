"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useDeleteRoom = () => {
  const [deleteRoomLoading, setDeleteRoomLoading] = useState<boolean>(false);
  const [deleteRoomError, setDeleteRoomError] = useState<string | null>(null);

  const deleteRoomMutation = useMutation(api.rooms.updateRoom);

  const deleteRoom = async (roomId: Id<"rooms">): Promise<boolean> => {
    setDeleteRoomLoading(true);
    setDeleteRoomError(null);

    try {
      const response = await deleteRoomMutation({
        roomId,
        updates: { isActive: false },
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setDeleteRoomError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setDeleteRoomError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setDeleteRoomLoading(false);
    }
  };

  return {
    deleteRoom,
    deleteRoomLoading,
    deleteRoomError,
    setDeleteRoomError,
  };
};
