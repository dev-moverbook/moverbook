"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { Trash2 } from "lucide-react";
import IconButton from "@/components/shared/buttons/IconButton";
import UserCardBorder from "@/components/shared/card/UserCardBorder";

interface InvitationCardProps {
  invitation: Doc<"invitations">;
  onRevokeClick: (invitationId: Id<"invitations">) => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onRevokeClick,
}) => {
  return (
    <UserCardBorder>
      <div>
        <p className="font-semibold">{invitation.email}</p>
        <p className="text-sm text-gray-500">{invitation.role}</p>
      </div>
      <IconButton
        onClick={() => onRevokeClick(invitation._id)}
        icon={<Trash2 className="w-4 h-4" />}
        variant="outline"
        title="Revoke Invitation"
      />
    </UserCardBorder>
  );
};

export default InvitationCard;
