"use client";

import PublicMoveCard from "@/components/publicMoveId/components/header/PublicMoveCard";
import PublicMoveNav from "@/components/publicMoveId/components/header/PublicMoveNav";
import ReviewLoader from "@/components/publicMoveId/components/review/ReviewLoader";
import PageContainer from "@/components/shared/containers/PageContainer";

const PublicMoveIdPage = () => {
  return (
    <>
      <PublicMoveNav />
      <PageContainer className="pt-10">
        <PublicMoveCard />
        <ReviewLoader />
      </PageContainer>
    </>
  );
};

export default PublicMoveIdPage;
