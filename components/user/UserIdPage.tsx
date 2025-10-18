"use client";

import { useRouter } from "next/navigation";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import UserIdContent from "./UserIdContent";

const UserIdPage: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SectionContainer isLast>
      <CenteredContainer className="md:px-0">
        <UserIdContent onBack={handleBack} />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default UserIdPage;
