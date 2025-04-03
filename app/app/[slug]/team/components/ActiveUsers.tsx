"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { useSlugContext } from "@/app/contexts/SlugContext";
import UserCard from "./UserCard";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";

const ActiveUsers = () => {
  const { companyId } = useSlugContext();

  // Run the query only if slug is defined.
  const usersResponse = useQuery(
    api.users.getAllUsersByCompanyId,
    companyId ? { companyId, isActive: true } : "skip"
  );

  if (!companyId) {
    return <div>Loading slug...</div>;
  }

  if (!usersResponse) {
    return <div>Loading users...</div>;
  }

  if (usersResponse.status === ResponseStatus.ERROR) {
    return <div>Error: {usersResponse.error}</div>;
  }

  return (
    <SectionContainer>
      <CenteredContainer>
        <h1 className="text-2xl font-bold mb-4">Active Users</h1>
        <div className="grid grid-cols-1 gap-4">
          {usersResponse.data.users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ActiveUsers;
