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
import SectionTitle from "@/app/components/shared/SectionTitle";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";

const TeamContent: React.FC = () => {
  const { companyId } = useSlugContext();

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
      <SectionHeaderWithAction
        title="Team"
        action={
          <Button className="" onClick={() => setIsInviteModalOpen(true)}>
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
      />
    </main>
  );
};

export default TeamContent;
