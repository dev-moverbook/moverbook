"use client";

import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import UserIdContent from "./UserIdContent";

const UserIdPage: React.FC = () => {
  return (
    <SectionContainer isLast>
      <CenteredContainer className="md:px-0">
        <UserIdContent />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default UserIdPage;
