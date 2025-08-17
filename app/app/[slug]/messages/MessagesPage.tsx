"use client";
import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import { QueryStatus } from "@/types/enums";
import { useRecentMessagesByCompanyId } from "@/app/hooks/queries/messages/useRecentMessagesByCompanyId";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import MessagesContent from "./MessagesContent";
import SectionContainer from "@/app/components/shared/SectionContainer";

const MessagesPage = () => {
  const { companyId, slug } = useSlugContext();
  const result = useRecentMessagesByCompanyId(companyId);

  let content: React.ReactNode = null;

  if (!slug) {
    return null;
  }

  switch (result.status) {
    case QueryStatus.LOADING:
      content = null;
      break;

    case QueryStatus.ERROR:
      content = <ErrorMessage message={result.errorMessage} />;
      break;

    case QueryStatus.SUCCESS:
      content = <MessagesContent messages={result.data} slug={slug} />;
      break;
  }

  return (
    <SectionContainer isLast>
      <CenteredContainer className="px-0 md:px-0">{content}</CenteredContainer>
    </SectionContainer>
  );
};

export default MessagesPage;
