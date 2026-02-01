"use client";
import React, { useState } from "react";
import InviteUserModal from "@/components/team/InviteUserModal";
import { useInviteUser } from "@/hooks/invitations/";
import { ClerkRoles } from "@/types/enums";
import { useSlugContext } from "@/contexts/SlugContext";
import TabContentContainer from "@/components/shared/containers/TabContentContainer";
import TabSelector from "@/components/shared/tab/TabSelector";
import { canManageCompany } from "@/frontendUtils/permissions";
import AddItemButton from "@/components/shared/buttons/AddItemButton";
import SectionHeaderWithAction from "@/components/shared/section/SectionHeaderWithAction";
import ActiveUsers from "@/components/team/ActiveUsers";
import InactiveUsers from "@/components/team/InactiveUsers";
import InvitedUsers from "@/components/team/InvitedUsers";

const TeamPage: React.FC = () => {
  const { companyId, user } = useSlugContext();

  const isCompanyManagerPermission = canManageCompany(user?.role);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("ACTIVE");

  const { inviteUser, inviteLoading, inviteError, setInviteError } =
    useInviteUser();

  const handleInviteUser = async (
    email: string,
    role: ClerkRoles,
    hourlyRate: number | null
  ): Promise<boolean> => {
    return await inviteUser(companyId, email, role, hourlyRate);
  };

  return (
    <>
      <SectionHeaderWithAction
        title="Team"
        action={
          isCompanyManagerPermission && (
            <AddItemButton
              label="User"
              onClick={() => setIsInviteModalOpen(true)}
            />
          )
        }
      />

      {isCompanyManagerPermission && (
        <TabSelector
          tabs={["ACTIVE", "INVITED", "DELETED"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      <TabContentContainer>
        {(!isCompanyManagerPermission || activeTab === "ACTIVE") && (
          <ActiveUsers />
        )}
        {isCompanyManagerPermission && activeTab === "INVITED" && (
          <InvitedUsers />
        )}
        {isCompanyManagerPermission && activeTab === "DELETED" && (
          <InactiveUsers />
        )}
      </TabContentContainer>

      {isCompanyManagerPermission && (
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={handleInviteUser}
          inviteLoading={inviteLoading}
          inviteError={inviteError}
          setInviteError={setInviteError}
        />
      )}
    </>
  );
};

export default TeamPage;
