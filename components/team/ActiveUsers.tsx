"use client";

import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import { useSlugContext } from "@/contexts/SlugContext";
import { useUsersByStatus } from "@/hooks/users/useActiveUsers";
import UsersListContent from "./UsersListContent";

const ActiveUsers = () => {
  const { companyId } = useSlugContext();
  const users = useUsersByStatus(companyId, true);

  return (
    <SectionContainer isLast>
      <CenteredContainer className="px-0 md:px-0">
        <UsersListContent
          users={users}
          isLoading={!users}
          emptyMessage="No active users."
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ActiveUsers;
