"use client";
import React from "react";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useUsersByStatus } from "@/app/hooks/queries/users/useActiveUsers";
import UsersListContent from "./UsersListContent";

const ActiveUsers = () => {
  const { companyId } = useSlugContext();
  const { users, isLoading, isError, errorMessage } = useUsersByStatus(
    companyId ?? null,
    true
  );

  return (
    <SectionContainer isLast>
      <CenteredContainer className="px-0 md:px-0">
        <UsersListContent
          users={users}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          emptyMessage="No active users."
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ActiveUsers;
