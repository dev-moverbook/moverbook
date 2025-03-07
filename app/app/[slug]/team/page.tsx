import React, { useState } from "react";
import InviteUserModal from "@/app/components/responsive/InviteUserModal";
import { Button } from "@/app/components/ui/button";
import ActiveUsers from "./components/ActiveUsers";
import InvitedUsers from "./components/InvitedUsers";
import InactiveUsers from "./components/InactiveUsers";
import { useInviteUser } from "@/app/hooks/useInviteUser";
import { ClerkRoles } from "@/types/enums";
import { useSlugContext } from "@/app/contexts/SlugContext";

interface TeamContentProps {}

const TeamContent: React.FC<TeamContentProps> = () => {
  const { state: slugState } = useSlugContext();
  const slug = slugState.slug as string;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<
    "active" | "invited" | "inactive"
  >("active");

  const { inviteUser, inviteLoading, inviteError } = useInviteUser();

  const handleInviteUser = async (
    email: string,
    role: ClerkRoles,
    hourlyRate: string | null
  ): Promise<boolean> => {
    return await inviteUser(slug, email, role, hourlyRate);
  };

  //invite state
  return (
    <div>
      <h1>Team Content</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 border rounded ${currentTab === "active" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
          onClick={() => setCurrentTab("active")}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 border rounded ${currentTab === "invited" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
          onClick={() => setCurrentTab("invited")}
        >
          Invited
        </button>
        <button
          className={`px-4 py-2 border rounded ${currentTab === "inactive" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
          onClick={() => setCurrentTab("inactive")}
        >
          Inactive
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {currentTab === "active" && <ActiveUsers />}
        {currentTab === "invited" && <InvitedUsers />}
        {currentTab === "inactive" && <InactiveUsers />}
      </div>

      <Button onClick={() => setIsInviteModalOpen(true)}>Invite User</Button>
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
        inviteLoading={inviteLoading}
        inviteError={inviteError}
      />
    </div>
  );
};

export default TeamContent;
