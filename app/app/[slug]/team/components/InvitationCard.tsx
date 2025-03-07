"use client";
import { Id } from "@/convex/_generated/dataModel";
import { InvitationSchema } from "@/types/convex-schemas";
import React from "react";
import { FaTrash } from "react-icons/fa";

interface InvitationCardProps {
  invitation: InvitationSchema;
  onRevokeClick: (invitationId: Id<"invitations">) => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onRevokeClick,
}) => {
  return (
    <div className="border rounded p-4 flex items-center justify-between">
      <div>
        <p className="font-semibold">{invitation.email}</p>
        <p className="text-sm text-gray-500">{invitation.role}</p>
      </div>
      <button onClick={() => onRevokeClick(invitation._id)}>
        {" "}
        <FaTrash className="text-red-500 hover:text-red-700" size={20} />
      </button>
    </div>
  );
};

export default InvitationCard;
