"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { RoomFormData } from "@/types/form-types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useCreateRoom = () => {
  const [createRoomLoading, setCreateRoomLoading] = useState<boolean>(false);
  const [createRoomError, setCreateRoomError] = useState<string | null>(null);

  const createRoomMutation = useMutation(api.rooms.createRoom);

  const createRoom = async (
    companyId: Id<"companies">,
    roomData: RoomFormData
  ): Promise<boolean> => {
    setCreateRoomLoading(true);
    setCreateRoomError(null);

    try {
      return await createRoomMutation({ companyId, ...roomData });
    } catch (error) {
      setErrorFromConvexError(error, setCreateRoomError);
      return false;
    } finally {
      setCreateRoomLoading(false);
    }
  };

  return {
    createRoom,
    createRoomLoading,
    createRoomError,
    setCreateRoomError,
  };
};
