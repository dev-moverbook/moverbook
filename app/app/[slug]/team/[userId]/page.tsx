"use client";

import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import UserIdContent from "./UserIdContent";
import { useUserById } from "@/app/hooks/queries/users/useUserById";

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const id = userId as Id<"users">;
  const router = useRouter();

  const { user, isLoading, isError, errorMessage } = useUserById(id);

  const handleBack = () => {
    router.back();
  };

  let content: React.ReactNode;

  switch (true) {
    case isLoading:
      content = null;
      break;
    case isError:
      content = (
        <ErrorMessage message={errorMessage ?? "Failed to load user."} />
      );
      break;
    case !user:
      content = <ErrorMessage message="User not found." />;
      break;
    default:
      content = <UserIdContent userData={user!} onBack={handleBack} />;
      break;
  }

  return (
    <SectionContainer isLast>
      <CenteredContainer className="md:px-0">{content}</CenteredContainer>
    </SectionContainer>
  );
};

export default UserPage;
