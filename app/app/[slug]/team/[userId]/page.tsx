"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { Id } from "@/convex/_generated/dataModel";
import { UserSchema } from "@/types/convex-schemas";
import UserIdContent from "./UserIdContent";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { canManageCompany } from "@/app/frontendUtils/permissions";

const UserPage: React.FC = () => {
  const { user } = useUser();
  const { userId } = useParams();
  const id = userId as Id<"users">;

  const userResponse = useQuery(api.users.getUserById, { userId: id });

  if (!userResponse) {
    return <Skeleton className="" />;
  }
  if (userResponse.status === ResponseStatus.ERROR)
    return <div>Error: {userResponse.error}</div>;

  const userData = userResponse.data.user as UserSchema;
  const isCompanyManagerPermission = canManageCompany(
    user?.publicMetadata.role as string
  );

  return (
    <main className="min-h-100vh">
      <UserIdContent
        userData={userData}
        isCompanyManagerPermission={isCompanyManagerPermission}
      />
    </main>
  );
};

export default UserPage;
