"use client";
import React, { useState } from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { useQuery } from "convex/react";
import InvitationCard from "./InvitationCard";
import ResponsiveRevokeModal from "./ResponsiveRevokeModal";
import { InvitationSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import { useRevokeInvite } from "@/app/hooks/useRevokeInvite";

const InvitedUsers = () => {
  const { companyId } = useSlugContext();

  const { revokeInviteUser, revokeLoading, revokeError } = useRevokeInvite();
  const [selectedInvitationId, setSelectedInvitationId] =
    useState<Id<"invitations"> | null>(null);

  const invitationsResponse = useQuery(
    api.invitations.getActiveInvitationsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const [revokeModalOpen, setRevokeModalOpen] = useState<boolean>(false);

  if (!invitationsResponse) {
    return <div>Loading...</div>;
  }

  if (invitationsResponse.status === ResponseStatus.ERROR) {
    return <div>Error: {invitationsResponse.error}</div>;
  }

  const handleRevokeClick = (invitationId: Id<"invitations">) => {
    setSelectedInvitationId(invitationId);
    setRevokeModalOpen(true);
  };

  const handleConfirmRevoke = async () => {
    if (!selectedInvitationId) {
      return;
    }
    const success = await revokeInviteUser(selectedInvitationId);
    if (success) {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedInvitationId(null);
    setRevokeModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Invited Users</h2>
      <div className="grid grid-cols-1 gap-4">
        {invitationsResponse.data.invitations.map(
          (invitation: InvitationSchema) => (
            <InvitationCard
              key={invitation._id}
              invitation={invitation}
              onRevokeClick={handleRevokeClick}
            />
          )
        )}
      </div>
      <ResponsiveRevokeModal
        isOpen={revokeModalOpen && !!selectedInvitationId}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRevoke}
        revokeLoading={revokeLoading}
        revokeError={revokeError}
      />
    </div>
  );
};

export default InvitedUsers;
