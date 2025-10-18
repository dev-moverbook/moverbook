"use client";
import React from "react";
import { useSlugContext } from "@/contexts/SlugContext";
import CenteredContainer from "@/components/shared/CenteredContainer";
import SectionContainer from "@/components/shared/SectionContainer";
import { useUsersByStatus } from "@/hooks/users/useActiveUsers";
import UsersListContent from "./UsersListContent";

const InactiveUsers = () => {
  const { companyId } = useSlugContext();
  const users = useUsersByStatus(companyId, false);

  return (
    <SectionContainer isLast>
      <CenteredContainer className="px-0">
        <UsersListContent
          users={users}
          isLoading={!users}
          emptyMessage="No inactive users."
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default InactiveUsers;
