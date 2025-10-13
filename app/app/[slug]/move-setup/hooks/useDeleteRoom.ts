"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useDeleteRoom = () => {
  const [deleteRoomLoading, setDeleteRoomLoading] = useState<boolean>(false);
  const [deleteRoomError, setDeleteRoomError] = useState<string | null>(null);

  const deleteRoomMutation = useMutation(api.rooms.updateRoom);

  const deleteRoom = async (roomId: Id<"rooms">): Promise<boolean> => {
    setDeleteRoomLoading(true);
    setDeleteRoomError(null);

    try {
      await deleteRoomMutation({
        roomId,
        updates: { isActive: false },
      });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setDeleteRoomError);
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
