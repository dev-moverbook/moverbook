"use client";
import React from "react";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import EmptyList from "@/app/components/shared/message/EmptyList";
import ContainerUserCard from "@/app/components/shared/ContainerUserCard";
import { Doc } from "@/convex/_generated/dataModel";
import UserCard from "./UserCard";

type Props = {
  users: Doc<"users">[] | null | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  emptyMessage: string;
};

const UsersListContent: React.FC<Props> = ({
  users,
  isLoading,
  isError,
  errorMessage,
  emptyMessage,
}) => {
  switch (true) {
    case isLoading:
      return null;

    case isError:
      return <ErrorMessage message={errorMessage ?? "Failed to load users."} />;

    case !users || users.length === 0:
      return <EmptyList className="pt-4 pl-4" message={emptyMessage} />;

    default:
      return (
        <ContainerUserCard>
          {users.map((u) => (
            <UserCard key={u._id} user={u} />
          ))}
        </ContainerUserCard>
      );
  }
};

export default UsersListContent;
