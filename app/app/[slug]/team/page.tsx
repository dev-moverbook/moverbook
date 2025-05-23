"use client";
import React, { useState } from "react";
import InviteUserModal from "@/app/components/responsive/InviteUserModal";
import { Button } from "@/app/components/ui/button";
import ActiveUsers from "./components/ActiveUsers";
import InvitedUsers from "./components/InvitedUsers";
import InactiveUsers from "./components/InactiveUsers";
import { useInviteUser } from "@/app/hooks/useInviteUser";
import { ClerkRoles } from "@/types/enums";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { FrontEndErrorMessages } from "@/types/errors";
import TabContentContainer from "@/app/components/shared/TabContentContainer";
import TabSelector from "@/app/components/shared/TabSelector";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";
import { useUser } from "@clerk/nextjs";
import { canManageCompany } from "@/app/frontendUtils/permissions";
const TeamContent: React.FC = () => {
  const { companyId } = useSlugContext();
  const { user } = useUser();

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
    hourlyRate: string | null
  ): Promise<boolean> => {
    if (!companyId) {
      setInviteError(FrontEndErrorMessages.GENERIC);
      return false;
    }
    return await inviteUser(companyId, email, role, hourlyRate);
  };

  return (
    <main>
      {isCompanyManagerPermission ? (
        <>
          <SectionHeaderWithAction
            title="Team"
            action={
              <Button onClick={() => setIsInviteModalOpen(true)}>
                + Invite User
              </Button>
            }
          />
          <TabSelector
            tabs={["ACTIVE", "INVITED", "DELETED"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <TabContentContainer>
            {activeTab === "ACTIVE" && <ActiveUsers />}
            {activeTab === "INVITED" && <InvitedUsers />}
            {activeTab === "DELETED" && <InactiveUsers />}
          </TabContentContainer>

          <InviteUserModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onInvite={handleInviteUser}
            inviteLoading={inviteLoading}
            inviteError={inviteError}
            setInviteError={setInviteError}
          />
        </>
      ) : (
        <TabContentContainer>
          <ActiveUsers />
        </TabContentContainer>
      )}
    </main>
  );
};

export default TeamContent;
