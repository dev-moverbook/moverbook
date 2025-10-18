import React from "react";
import EmptyList from "@/components/shared/message/EmptyList";
import ContainerUserCard from "@/components/shared/ContainerUserCard";
import { Doc } from "@/convex/_generated/dataModel";
import UserCard from "./UserCard";

type Props = {
  users: Doc<"users">[] | null | undefined;
  isLoading: boolean;
  emptyMessage: string;
};

const UsersListContent: React.FC<Props> = ({
  users,
  isLoading,
  emptyMessage,
}) => {
  switch (true) {
    case isLoading:
      return null;

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
