"use client";

import { useRouter } from "next/navigation";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import UserIdContent from "./UserIdContent";
import { useUserById } from "@/app/hooks/queries/users/useUserById";
import { useUserId } from "@/app/contexts/UserIdContext";

const UserPage: React.FC = () => {
  const { userId } = useUserId();
  const router = useRouter();

  const user = useUserById(userId);

  const handleBack = () => {
    router.back();
  };

  let content: React.ReactNode;

  switch (true) {
    case !user:
      content = null;
      break;
    default:
      content = <UserIdContent userData={user} onBack={handleBack} />;
      break;
  }

  return (
    <SectionContainer isLast>
      <CenteredContainer className="md:px-0">{content}</CenteredContainer>
    </SectionContainer>
  );
};

export default UserPage;
