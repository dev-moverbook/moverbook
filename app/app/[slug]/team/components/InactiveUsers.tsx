"use client";
import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/SectionContainer";
import { useUsersByStatus } from "@/app/hooks/queries/users/useActiveUsers";
import UsersListContent from "./UsersListContent";

const InactiveUsers = () => {
  const { companyId } = useSlugContext();
  const { users, isLoading, isError, errorMessage } = useUsersByStatus(
    companyId ?? null,
    false
  );

  return (
    <SectionContainer isLast>
      <CenteredContainer className="px-0">
        <UsersListContent
          users={users}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          emptyMessage="No inactive users."
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default InactiveUsers;
