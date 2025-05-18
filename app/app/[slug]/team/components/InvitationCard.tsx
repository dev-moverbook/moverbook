"use client";
import { Id } from "@/convex/_generated/dataModel";
import { InvitationSchema } from "@/types/convex-schemas";
import React from "react";
import { Trash2 } from "lucide-react";
import IconButton from "@/app/components/shared/IconButton";
import { ClerkRoleLabels, ClerkRoles } from "@/types/enums";
import UserCardBorder from "@/app/components/shared/UserCardBorder";

interface InvitationCardProps {
  invitation: InvitationSchema;
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
        <p className="text-sm text-gray-500">
          {ClerkRoleLabels[invitation.role as ClerkRoles] || invitation.role}
        </p>
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
