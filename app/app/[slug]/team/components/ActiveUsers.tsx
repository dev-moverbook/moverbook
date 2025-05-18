"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { useSlugContext } from "@/app/contexts/SlugContext";
import UserCard from "./UserCard";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ContainerUserCard from "@/app/components/shared/ContainerUserCard";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
const ActiveUsers = () => {
  const { companyId } = useSlugContext();

  // Run the query only if slug is defined.
  const usersResponse = useQuery(
    api.users.getAllUsersByCompanyId,
    companyId ? { companyId, isActive: true } : "skip"
  );

  console.log("usersResponse", usersResponse);
  if (!companyId) {
    return <Skeleton />;
  }

  if (!usersResponse) {
    return <Skeleton />;
  }

  if (usersResponse.status === ResponseStatus.ERROR) {
    return <ErrorMessage message={usersResponse.error} />;
  }

  return (
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader title="Active Users" />
        <ContainerUserCard>
          {" "}
          {usersResponse.data.users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </ContainerUserCard>{" "}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ActiveUsers;
