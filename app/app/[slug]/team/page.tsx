"use client";
import React, { useState } from "react";
import InviteUserModal from "@/app/components/responsive/InviteUserModal";
import ActiveUsers from "./components/ActiveUsers";
import InvitedUsers from "./components/InvitedUsers";
import InactiveUsers from "./components/InactiveUsers";
import { useInviteUser } from "@/app/hooks/useInviteUser";
import { ClerkRoles } from "@/types/enums";
import { useSlugContext } from "@/app/contexts/SlugContext";
import TabContentContainer from "@/app/components/shared/TabContentContainer";
import TabSelector from "@/app/components/shared/TabSelector";
import { canManageCompany } from "@/app/frontendUtils/permissions";
import AddItemButton from "@/app/components/shared/buttons/AddItemButton";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";

const TeamContent: React.FC = () => {
  const { companyId, user } = useSlugContext();

  const isCompanyManagerPermission = canManageCompany(
    user?.publicMetadata.role as string
  );

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
    <main>
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
    </main>
  );
};

export default TeamContent;
