"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface UpdateRoomData {
  name?: string;
}

export const useUpdateRoom = () => {
  const [updateRoomLoading, setUpdateRoomLoading] = useState<boolean>(false);
  const [updateRoomError, setUpdateRoomError] = useState<string | null>(null);

  const updateRoomMutation = useMutation(api.rooms.updateRoom);

  const updateRoom = async (
    roomId: Id<"rooms">,
    updates: UpdateRoomData
  ): Promise<boolean> => {
    setUpdateRoomLoading(true);
    setUpdateRoomError(null);

    try {
      return await updateRoomMutation({ roomId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setUpdateRoomError);
      return false;
    } finally {
      setUpdateRoomLoading(false);
    }
  };

  return {
    updateRoom,
    updateRoomLoading,
    updateRoomError,
    setUpdateRoomError,
  };
};
