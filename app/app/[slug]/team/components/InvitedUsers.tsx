"use client";
import React, { useState } from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { Id } from "@/convex/_generated/dataModel";
import { useRevokeInvite } from "@/app/hooks/useRevokeInvite";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import ContainerUserCard from "@/app/components/shared/ContainerUserCard";
import EmptyList from "@/app/components/shared/message/EmptyList";
import InvitationCard from "./InvitationCard";
import ResponsiveRevokeModal from "./ResponsiveRevokeModal";
import { InvitationSchema } from "@/types/convex-schemas";
import { useActiveInvitations } from "@/app/hooks/queries/invitations/useActiveInvitations";

const InvitedUsers = () => {
  const { companyId } = useSlugContext();
  const invitations = useActiveInvitations(companyId);

  const { revokeInviteUser, revokeLoading, revokeError } = useRevokeInvite();
  const [selectedInvitationId, setSelectedInvitationId] =
    useState<Id<"invitations"> | null>(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);

  const handleRevokeClick = (invitationId: Id<"invitations">) => {
    setSelectedInvitationId(invitationId);
    setRevokeModalOpen(true);
  };

  const handleConfirmRevoke = async () => {
    if (!selectedInvitationId) return;
    const success = await revokeInviteUser(selectedInvitationId);
    if (success) handleCloseModal();
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
            {invitations.map((inv: InvitationSchema) => (
              <InvitationCard
                key={inv._id}
                invitation={inv}
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

        <ResponsiveRevokeModal
          isOpen={revokeModalOpen && !!selectedInvitationId}
          onClose={handleCloseModal}
          onConfirm={handleConfirmRevoke}
          revokeLoading={revokeLoading}
          revokeError={revokeError}
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default InvitedUsers;
