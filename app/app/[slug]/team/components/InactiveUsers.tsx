import { useSlugContext } from "@/app/contexts/SlugContext";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { useQuery } from "convex/react";
import React from "react";
import UserCard from "./UserCard";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import ContainerUserCard from "@/app/components/shared/ContainerUserCard";
import SectionContainer from "@/app/components/shared/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import EmptyList from "@/app/components/shared/message/EmptyList";
const InactiveUsers = () => {
  const { companyId } = useSlugContext();

  // Run the query using the slug from the context.
  const usersResponse = useQuery(
    api.users.getAllUsersByCompanyId,
    companyId ? { companyId, isActive: false } : "skip"
  );

  if (!usersResponse) {
    return <Skeleton />;
  }

  if (usersResponse.status === ResponseStatus.ERROR) {
    return <ErrorMessage message={usersResponse.error} />;
  }
  return (
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader title="Inactive Users" />
        {usersResponse.data.users.length > 0 ? (
          <ContainerUserCard>
            {usersResponse.data.users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </ContainerUserCard>
        ) : (
          <EmptyList message="No inactive users." />
        )}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default InactiveUsers;
