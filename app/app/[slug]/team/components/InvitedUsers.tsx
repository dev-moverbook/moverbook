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
import SectionHeader from "@/app/components/shared/SectionHeader";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import ContainerUserCard from "@/app/components/shared/ContainerUserCard";
import { Skeleton } from "@/components/ui/skeleton";

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
    return <Skeleton />;
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
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader title="Invited Users" />
        <ContainerUserCard>
          {" "}
          {invitationsResponse.data.invitations.map(
            (invitation: InvitationSchema) => (
              <InvitationCard
                key={invitation._id}
                invitation={invitation}
                onRevokeClick={handleRevokeClick}
              />
            )
          )}
        </ContainerUserCard>
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
