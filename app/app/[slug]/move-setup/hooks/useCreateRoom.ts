"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { RoomFormData } from "@/types/form-types";

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
      const response = await createRoomMutation({ companyId, ...roomData });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setCreateRoomError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateRoomError(FrontEndErrorMessages.GENERIC);
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
