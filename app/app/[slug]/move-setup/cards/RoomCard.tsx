"use client";

import React from "react";
import { RoomSchema } from "@/types/convex-schemas";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface RoomCardProps {
  room: RoomSchema;
  onEdit: (room: RoomSchema) => void;
  onDelete: (roomId: Id<"rooms">) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded shadow-sm space-y-2 bg-white">
      <p>
        <span className="font-medium">Room Name:</span> {room.name}
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex space-x-2">
        <Button onClick={() => onEdit(room)} className="mt-2">
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(room._id)}
          className="mt-2 bg-red-500 hover:bg-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default RoomCard;
