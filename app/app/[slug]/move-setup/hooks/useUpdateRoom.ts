"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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
      const response = await updateRoomMutation({ roomId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateRoomError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateRoomError(FrontEndErrorMessages.GENERIC);
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
