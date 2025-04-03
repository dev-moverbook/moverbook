"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { Id } from "@/convex/_generated/dataModel";
import { UserSchema } from "@/types/convex-schemas";
import UserIdContent from "./UserIdContent";
import { Skeleton } from "@/components/ui/skeleton";

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const id = userId as Id<"users">;

  const userResponse = useQuery(api.users.getUserById, { userId: id });

  if (!userResponse) {
    return <Skeleton className="" />;
  }
  if (userResponse.status === ResponseStatus.ERROR)
    return <div>Error: {userResponse.error}</div>;

  const user = userResponse.data.user as UserSchema;

  return (
    <main className="">
      <UserIdContent user={user} />
    </main>
  );
};

export default UserPage;
