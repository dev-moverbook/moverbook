"use client";
import React, { useState } from "react";
import { useSlugContext } from "@/contexts/SlugContext";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useRevokeInvite } from "@/hooks/invitations";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import ContainerUserCard from "@/components/shared/card/ContainerUserCard";
import EmptyList from "@/components/shared/message/EmptyList";
import InvitationCard from "./InvitationCard";
import { useActiveInvitations } from "@/hooks/invitations/useActiveInvitations";
import ConfirmModal from "../shared/modal/ConfirmModal";

const InvitedUsers = () => {
  const { companyId } = useSlugContext();
  const invitations = useActiveInvitations(companyId);

  const { revokeInviteUser, revokeLoading, revokeError } = useRevokeInvite();
  const [selectedInvitationId, setSelectedInvitationId] =
    useState<Id<"invitations"> | null>(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState<boolean>(false);

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

  const renderContent = () => {
    switch (true) {
      case invitations === undefined:
        return null;

      case invitations?.length === 0:
        return <EmptyList className="pt-4" message="No invited users." />;

      default:
        return (
          <ContainerUserCard className="px-0">
            {invitations.map((invitation: Doc<"invitations">) => (
              <InvitationCard
                key={invitation._id}
                invitation={invitation}
                onRevokeClick={handleRevokeClick}
              />
            ))}
          </ContainerUserCard>
        );
    }
  };

  return (
    <SectionContainer isLast>
      <CenteredContainer>
        {renderContent()}
        <ConfirmModal
          isOpen={revokeModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmRevoke}
          deleteLoading={revokeLoading}
          deleteError={revokeError}
          title="Confirm Delete"
          description="Are you sure you want to delete this room? This action cannot be undone."
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default InvitedUsers;
